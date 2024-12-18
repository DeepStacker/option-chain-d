import schedule
import time
import logging
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Optional
from functools import wraps
import pytz
import sys
import os
from contextlib import contextmanager

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from Urls import Urls
from Modals import get_data
from deltadb import get_delta_data
from Fut_Live import fetch_and_store_data

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("db_controller.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

# Constants
IST = pytz.timezone("Asia/Kolkata")
MAX_WORKERS = 200
TASK_INTERVAL = 15  # seconds
WEEKEND_DAYS = ["Saturday"]
MARKET_HOURS = {
    "start": {"hour": 0, "minute": 5},
    "end": {"hour": 15, "minute": 30},
    "pause": {"hour": 9, "minute": 7},
    "resume": {"hour": 9, "minute": 15},
}


class TaskExecutionError(Exception):
    """Custom exception for task execution errors"""

    pass


def retry_on_failure(max_retries: int = 3, delay: int = 1):
    """Decorator to retry failed operations"""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        logger.error(f"Failed after {max_retries} attempts: {str(e)}")
                        raise
                    logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
                    time.sleep(delay)
            return None

        return wrapper

    return decorator


@contextmanager
def task_executor():
    """Context manager for ThreadPoolExecutor"""
    executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
    try:
        yield executor
    finally:
        executor.shutdown(wait=True)


class DataController:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
        self.running = True
        self.last_processed_time = None
        self.processing_batch = False

    @retry_on_failure(max_retries=3)
    def execute_task(self, task_func: callable, *args) -> Optional[dict]:
        """Execute a single task with error handling"""
        try:
            return task_func(*args)
        except Exception as e:
            logger.error(
                f"Task execution failed: {task_func.__name__}, Error: {str(e)}"
            )
            raise TaskExecutionError(
                f"Failed to execute {task_func.__name__}: {str(e)}"
            )

    def should_process_batch(self) -> bool:
        """Check if enough time has passed since the last batch"""
        if self.last_processed_time is None:
            return True

        time_elapsed = time.time() - self.last_processed_time
        return time_elapsed >= TASK_INTERVAL

    def run_tasks(self, symbol: str, exp: str) -> None:
        """Run all tasks for a given symbol and expiry"""
        logger.info(f"Running tasks for symbol: {symbol} with expiry: {exp}")

        tasks = [
            (get_delta_data, (exp, Urls.symbol_list[symbol], Urls.seg_list[symbol])),
            (get_data, (exp, Urls.symbol_list[symbol], Urls.seg_list[symbol])),
            (
                fetch_and_store_data,
                (exp, Urls.symbol_list[symbol], Urls.seg_list[symbol]),
            ),
        ]

        futures = []
        for task_func, args in tasks:
            future = self.executor.submit(self.execute_task, task_func, *args)
            futures.append(future)

        # Wait for all tasks to complete and handle any errors
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                logger.error(f"Task failed: {str(e)}")

    def run_all_symbol_tasks(self, symbols_data: List[tuple]) -> None:
        """Run tasks for all symbols concurrently"""
        if self.processing_batch:
            logger.warning("Previous batch still processing, skipping this run")
            return

        try:
            self.processing_batch = True
            all_futures = []

            # Create futures for all symbols and all tasks
            for symbol, exp in symbols_data:
                tasks = [
                    (
                        get_delta_data,
                        (exp, Urls.symbol_list[symbol], Urls.seg_list[symbol]),
                    ),
                    (get_data, (exp, Urls.symbol_list[symbol], Urls.seg_list[symbol])),
                    (
                        fetch_and_store_data,
                        (exp, Urls.symbol_list[symbol], Urls.seg_list[symbol]),
                    ),
                ]

                for task_func, args in tasks:
                    future = self.executor.submit(self.execute_task, task_func, *args)
                    all_futures.append((symbol, task_func.__name__, future))

            # Process all futures as they complete
            completed_symbols = set()
            for future_info in as_completed([f[2] for f in all_futures]):
                symbol, task_name, future = [
                    f for f in all_futures if f[2] == future_info
                ][0]
                try:
                    future.result()
                    logger.info(f"Completed {task_name} for {symbol}")
                    completed_symbols.add(symbol)
                except Exception as e:
                    logger.error(f"Failed {task_name} for {symbol}: {str(e)}")

            logger.info(f"Batch completed. Processed symbols: {len(completed_symbols)}")
            self.last_processed_time = time.time()

        finally:
            self.processing_batch = False

    def is_market_hours(self, current_time: datetime) -> bool:
        """Check if current time is within market hours"""
        return MARKET_HOURS["start"]["hour"] <= current_time.hour < MARKET_HOURS["end"][
            "hour"
        ] or (
            current_time.hour == MARKET_HOURS["end"]["hour"]
            and current_time.minute < MARKET_HOURS["end"]["minute"]
        )

    def is_crude_oil_hours(self, current_time: datetime) -> bool:
        """Check if current time is within CRUDEOIL trading hours"""
        return (
            self.is_market_hours(current_time)
            or current_time.hour < 24
            or (current_time.hour == 24 and current_time.minute <= 0)
        )

    def scheduled_run(self) -> None:
        """Execute scheduled tasks based on market timing"""
        try:
            # Check if enough time has passed since last batch
            if not self.should_process_batch():
                logger.debug("Waiting for interval before next batch")
                return

            current_time = datetime.now(IST)
            current_day = current_time.strftime("%A")

            if current_day in WEEKEND_DAYS:
                logger.info("Weekend - No tasks scheduled")
                return

            # Collect all valid symbols and their expiry data
            symbols_to_process = []

            for symbol in Urls.symbol_list.keys():
                try:
                    expiry_data = Urls.fetch_expiry(
                        Urls.symbol_list[symbol], Urls.seg_list[symbol]
                    )
                    exp = list(expiry_data["data"]["explist"])[0]

                    if symbol == "CRUDEOIL":
                        if self.is_crude_oil_hours(current_time):
                            symbols_to_process.append((symbol, exp))
                        else:
                            logger.info("Skipping CRUDEOIL - Outside trading hours")
                    else:
                        if self.is_market_hours(current_time):
                            symbols_to_process.append((symbol, exp))
                        else:
                            logger.info(f"Skipping {symbol} - Outside market hours")
                except Exception as e:
                    logger.error(f"Error processing symbol {symbol}: {str(e)}")

            # Process all valid symbols concurrently
            if symbols_to_process:
                logger.info(
                    f"Starting new batch: Processing {len(symbols_to_process)} symbols"
                )
                self.run_all_symbol_tasks(symbols_to_process)
            else:
                logger.info("No symbols to process at this time")

        except Exception as e:
            logger.error(f"Scheduled run failed: {str(e)}")

    def start_schedule(self) -> None:
        """Initialize and start the scheduler"""
        try:
            # Regular task schedule
            schedule.every(TASK_INTERVAL).seconds.do(self.scheduled_run).tag("task_run")

            # Market timing schedules
            schedule.every().day.at(
                f"{MARKET_HOURS['pause']['hour']:02d}:{MARKET_HOURS['pause']['minute']:02d}"
            ).do(lambda: schedule.clear("task_run"))
            schedule.every().day.at(
                f"{MARKET_HOURS['resume']['hour']:02d}:{MARKET_HOURS['resume']['minute']:02d}"
            ).do(
                lambda: schedule.every(TASK_INTERVAL)
                .seconds.do(self.scheduled_run)
                .tag("task_run")
            )
            schedule.every().day.at(
                f"{MARKET_HOURS['end']['hour']:02d}:{MARKET_HOURS['end']['minute']:02d}"
            ).do(lambda: schedule.clear("task_run"))

            logger.info("Scheduler started successfully")
        except Exception as e:
            logger.error(f"Failed to start scheduler: {str(e)}")
            raise

    def run(self) -> None:
        """Main run loop"""
        self.start_schedule()
        try:
            while self.running:
                schedule.run_pending()
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Shutting down gracefully...")
        finally:
            self.executor.shutdown(wait=True)
            logger.info("Shutdown complete")


if __name__ == "__main__":
    controller = DataController()
    controller.run()
