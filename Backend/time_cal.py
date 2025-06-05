from datetime import datetime, timezone, timedelta


def get_time_diff_in_days(timestamp):
    # Convert timestamp to a timezone-aware datetime object (UTC)
    timestamp_dt = datetime.fromtimestamp(timestamp, timezone.utc)

    # Convert UTC to IST by adding 5 hours and 30 minutes
    timestamp_ist = timestamp_dt + timedelta(hours=5, minutes=30)

    # Extract day and month from the timestamp and set time to 3:30 pm IST
    timestamp_target_time = timestamp_ist.replace(
        hour=15, minute=31, second=0, microsecond=0
    )

    # Get the current datetime in UTC and convert to IST
    current_dt_utc = datetime.now(timezone.utc)
    current_dt_ist = current_dt_utc + timedelta(hours=5, minutes=30)
    yesterday_ist = current_dt_ist - timedelta(days=1)

    # Define target time as today at 3:30 pm IST
    current_target_time_ist = current_dt_ist.replace(
        hour=15, minute=30, second=0, microsecond=0
    )

    current_target_time_yesterday = current_dt_ist.replace(
        hour=9, minute=0, second=0, microsecond=0
    )

    yesterday_target_time_ist = yesterday_ist.replace(
        hour=15, minute=30, second=0, microsecond=0
    )

    # If the current time is later than 3:30 pm IST, keep 3:30 pm today as the target
    # Otherwise, use the current time until 3:30 pm
    if current_dt_ist > current_target_time_ist:
        current_time = current_target_time_ist
    elif current_dt_ist < current_target_time_yesterday:
        current_time = yesterday_target_time_ist
    else:
        current_time = current_dt_ist

    # Remove the year component by setting both dates to a common year (e.g., 2000)
    timestamp_target_time = timestamp_target_time.replace(year=2000)
    current_time = current_time.replace(year=2000)

    # Calculate the difference in days (excluding the year)
    time_diff = timestamp_target_time - current_time
    days_diff = time_diff.total_seconds() / (24 * 3600)

    # Ensure we never return negative time
    return max(days_diff - 1, 0.01)
