import schedule
import time
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
from Modals import get_data
from deltadb import get_delta_data
from Fut_Live import fetch_and_store_data
import pytz
import sys
import os

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
        )
    ),
)
from Urls import Urls

# Define Indian Standard Time (IST)
IST = pytz.timezone("Asia/Kolkata")

# Initialize ThreadPoolExecutor once
executor = ThreadPoolExecutor(max_workers=200)


# Function to run tasks for the specified symbols
def run_tasks(symbol, exp):
    print(f"Running tasks for symbol: {symbol} with expiry: {exp}")
    executor.submit(
        get_delta_data, exp, Urls.symbol_list[symbol], Urls.seg_list[symbol]
    )
    executor.submit(get_data, exp, Urls.symbol_list[symbol], Urls.seg_list[symbol])
    executor.submit(
        fetch_and_store_data, exp, Urls.symbol_list[symbol], Urls.seg_list[symbol]
    )


# Function to fetch and execute tasks based on time and symbol
def scheduled_run():
    current_time = datetime.now(IST)
    current_day = current_time.strftime("%A")

    # Check for weekend
    if current_day in ["Saturday", "Sunday"]:
        print("Today is a weekend. No tasks will be run.")
        return

    symbols = Urls.symbol_list.keys()

    # Run tasks based on the time window and symbol
    for symbol in symbols:
        expiry_data = Urls.fetch_expiry(Urls.symbol_list[symbol], Urls.seg_list[symbol])
        exp = list(expiry_data["data"]["explist"])[0]

        if symbol == "CRUDEOIL":
            if (
                9 <= current_time.hour < 15
                or current_time.hour < 24
                or (current_time.hour == 24 and current_time.minute <= 00)
            ):
                run_tasks(symbol, exp)
            else:
                print("Skipping CRUDEOIL as it is past 11:45 PM IST.")
        else:
            if 9 <= current_time.hour < 15 or (
                current_time.hour == 15 and current_time.minute <= 30
            ):
                run_tasks(symbol, exp)
            else:
                print(f"Skipping {symbol} outside of scheduled hours.")


# Scheduler setup
def start_schedule():
    # Run scheduled tasks every 10 seconds
    schedule.every(10).seconds.do(scheduled_run).tag("task_run")

    # Pause the scheduler at 9:07 AM and resume at 9:15 AM
    schedule.every().day.at("09:07").do(lambda: schedule.clear("task_run"))
    schedule.every().day.at("09:15").do(
        lambda: schedule.every(10).seconds.do(scheduled_run).tag("task_run")
    )

    # Stop tasks for non-CRUDEOIL symbols at 3:30 PM IST
    schedule.every().day.at("15:30").do(lambda: schedule.clear("task_run"))

    print("Scheduler started. Tasks will run as per the IST schedule.")


# Run the scheduler
start_schedule()
try:
    while True:
        schedule.run_pending()
        # time.sleep(10)
except KeyboardInterrupt:
    print("Scheduler stopped.")
    executor.shutdown(wait=True)
