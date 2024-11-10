from flask import Flask, request, jsonify
from flask_cors import CORS
from APIs import App
import logging


app = Flask(__name__)

# Explicitly allow localhost:5173
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:5173",
                "http://192.168.56.1:5173",
                "https://stockify-oc.vercel.app",
                "https://stockify-oc.onrender.com",
            ]
        }
    },
)


@app.route("/api/live-data", methods=["GET"])
def live_data():
    symbol = request.args.get("sid")
    exp = request.args.get("exp")
    return App.get_live_data(symbol, exp)


@app.route("/api/exp-date", methods=["GET"])
def exp_date():
    symbol = request.args.get("sid")
    exp = request.args.get("exp")
    return App.get_exp_date(symbol)


@app.route("/api/percentage-data", methods=["POST"])
def percentage_data():
    """Endpoint to get percentage data based on strike price."""
    data = request.json
    symbol = data.get("sid")
    exp = data.get("exp")
    isCe = data.get("isCe")
    strike = data.get("strike")

    response, status_code = App.get_percentage_data(symbol, exp, isCe, strike)
    return response, status_code


@app.route("/api/iv-data", methods=["POST"])
def iv_data():
    """Endpoint to get iv data based on strike price."""
    data = request.json
    symbol = data.get("sid")
    exp = data.get("exp")
    isCe = data.get("isCe")
    strike = data.get("strike")

    response, status_code = App.get_iv_data(symbol, exp, isCe, strike)
    return response, status_code


@app.route("/api/delta-data", methods=["POST"])
def delta_data():
    """Endpoint to get delta data based on strike price."""
    data = request.json
    symbol = data.get("sid")
    exp = data.get("exp")
    strike = data.get("strike")

    response, status_code = App.get_delta_data(symbol, exp, strike)
    return response, status_code


@app.route("/api/fut-data", methods=["POST"])
def fut_data():
    """Endpoint to get fut data based on strike price."""
    data = request.json
    symbol = data.get("sid")
    exp = data.get("exp")
    # strike = data.get('strike')

    response, status_code = App.get_fut_data(symbol, exp)
    return response, status_code


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8000, debug=True)
