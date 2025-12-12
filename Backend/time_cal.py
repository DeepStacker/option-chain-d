from datetime import datetime, timezone, timedelta

def get_time_diff_in_days(timestamp):
    """
    Calculates the difference in days (excluding the year) between a given UTC timestamp and
    a target reference time in IST, based on whether the current time is before or after 3:30 PM IST.
    
    Returns:
        float: Difference in days (minimum 0.000001, never negative).
    """
    IST_OFFSET = timedelta(hours=5, minutes=30)

    # Step 1: Convert timestamp to IST
    timestamp_dt_utc = datetime.fromtimestamp(timestamp, timezone.utc)
    timestamp_ist = timestamp_dt_utc + IST_OFFSET
    timestamp_target = timestamp_ist.replace(hour=15, minute=31, second=0, microsecond=0)

    # Step 2: Get current time in IST
    now_utc = datetime.now(timezone.utc)
    now_ist = now_utc + IST_OFFSET

    # Step 3: Define potential reference times
    today_1530_ist = now_ist.replace(hour=15, minute=30, second=0, microsecond=0)
    today_0900_ist = now_ist.replace(hour=9, minute=0, second=0, microsecond=0)
    yesterday_ist = now_ist - timedelta(days=1)
    yesterday_1530_ist = yesterday_ist.replace(hour=15, minute=30, second=0, microsecond=0)

    # Step 4: Choose comparison "current" time based on rules
    if now_ist > today_1530_ist:
        reference_time = today_1530_ist
    elif now_ist < today_0900_ist:
        reference_time = yesterday_1530_ist
    else:
        reference_time = now_ist

    # Step 5: Normalize both dates to a common year (to exclude year in day-diff)
    common_year = 2000
    timestamp_target = timestamp_target.replace(year=common_year)
    reference_time = reference_time.replace(year=common_year)

    # Step 6: Calculate difference in days
    day_diff = (timestamp_target - reference_time).total_seconds() / (24 * 3600)
    print(f"Day difference: {day_diff - 1}")

    # Step 7: Ensure non-negative and minimal return
    return max(day_diff - 1, 0.000001)
