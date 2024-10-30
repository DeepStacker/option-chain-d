from flask import Flask, request, jsonify
from flask_cors import CORS
from APIs import App
import logging

app = Flask(__name__)

# Explicitly allow localhost:5173
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://192.168.56.1:5173"]}})


@app.route('/api/live-data', methods=['GET'])
def live_data():
    symbol = request.args.get('sid')
    exp = request.args.get('exp')
    return App.get_live_data(symbol, exp)

@app.route('/api/exp-date', methods=['GET'])
def exp_date():
    symbol = request.args.get('sid')
    exp = request.args.get('exp')
    return App.get_exp_date(symbol, exp)

@app.route('/api/percentage-data', methods=['POST'])
def percentage_data():
    """Endpoint to get percentage data based on strike price."""
    data = request.json
    symbol = data.get('sid')
    exp = data.get('exp')
    isCe = data.get('isCe')
    strike = data.get('strike')

    # Log the received data for debugging
    app.logger.debug(f"Received data: {data}")

    # Get percentage data
    response, status_code = App.get_percentage_data(symbol, exp, isCe, strike)
    return response, status_code

# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=8000, debug=True)
