from flask import Blueprint, jsonify, current_app
from flask_cors import cross_origin

option_chain_bp = Blueprint('option_chain', __name__)

@option_chain_bp.route('/exp-date', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def get_expiry_dates():
    try:
        # Sample expiry dates - replace with your actual data source
        expiry_dates = [
            "2024-01-04",
            "2024-01-11",
            "2024-01-18",
            "2024-01-25",
            "2024-02-01"
        ]
        return jsonify(expiry_dates), 200
    except Exception as e:
        current_app.logger.error(f"Error in get_expiry_dates: {str(e)}")
        return jsonify({"error": str(e)}), 500

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
                },
                # Add more call options...
            ],
            "puts": [
                {
                    "strike_price": 21000,
                    "last_price": 450,
                    "change": -15,
                    "volume": 800,
                    "open_interest": 4500,
                    "iv": 14.8
                },
                # Add more put options...
            ]
        }
        return jsonify(option_chain_data), 200
    except Exception as e:
        current_app.logger.error(f"Error in get_option_chain: {str(e)}")
        return jsonify({"error": str(e)}), 500
