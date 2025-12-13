from flask import Blueprint, jsonify, current_app, request
from flask_cors import cross_origin
from datetime import datetime, timedelta

option_chain_bp = Blueprint('option_chain', __name__)

@option_chain_bp.route('/exp-date/', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def get_expiry_dates():
    try:
        # Get the symbol from query parameters
        symbol = request.args.get('sid')
        if not symbol:
            return jsonify({"error": "Symbol (sid) is required"}), 400

        # Generate expiry dates for the next 12 weeks
        expiry_dates = []
        current_date = datetime.now()
        
        # Find the next Thursday
        days_until_thursday = (3 - current_date.weekday()) % 7
        next_thursday = current_date + timedelta(days=days_until_thursday)
        
        # Generate 12 weekly expiry dates
        for i in range(12):
            expiry_date = next_thursday + timedelta(weeks=i)
            expiry_dates.append(expiry_date.strftime("%Y-%m-%d"))

        return jsonify(expiry_dates), 200
    except Exception as e:
        current_app.logger.error(f"Error in get_expiry_dates: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@option_chain_bp.route('/option-chain/<expiry_date>', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def get_option_chain(expiry_date):
    try:
        # Sample option chain data - replace with your actual data source
        option_chain_data = {
            "calls": [
                {
                    "strike_price": 21000,
                    "last_price": 500,
                    "change": 25,
                    "volume": 1000,
                    "open_interest": 5000,
                    "iv": 15.5
                }
            ],
            "puts": [
                {
                    "strike_price": 21000,
                    "last_price": 450,
                    "change": -15,
                    "volume": 800,
                    "open_interest": 4500,
                    "iv": 14.8
                }
            ]
        }
        return jsonify(option_chain_data), 200
    except Exception as e:
        current_app.logger.error(f"Error in get_option_chain: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
