from app import app
from DB_Data_Controller import start_schedule, schedule
import threading
import time


def run_scheduler():
    """Function to start and run the scheduler loop in a separate thread."""
    start_schedule()  # Initialize the scheduler
    while True:
        schedule.run_pending()
        time.sleep(10)


def start_flask():
    """Start the Flask app in the main thread."""
    print("Starting Flask server...")
    app.run(
        host="0.0.0.0", port=8000, debug=True, use_reloader=False
    )  # Avoid Flask reloading in debug mode


if __name__ == "__main__":
    # Start the scheduler in a separate daemon thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    # Start the Flask app
    start_flask()
