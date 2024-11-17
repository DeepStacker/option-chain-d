from flask import Flask, request, jsonify
from flask_cors import CORS
from APIs import App
import base64
from cryptography.fernet import Fernet

app = Flask(__name__)

# Create the cipher suite (ensure this matches the frontend)
custom_key = b"ic502HwMXu-wPla_WtYw5iNTQcJFILWskmGBiA9eBDA="  # Your current key

# Initialize Fernet with the correct base64 key
cipher_suite = Fernet(custom_key)  # Use the custom key directly

# Explicitly allow localhost:5173
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
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

    # Fetch live data
    live_data = App.get_live_data(symbol, exp)

    # Encrypt the data using Fernet
    encrypted_data = cipher_suite.encrypt(live_data.encode())

    # Return the encrypted data as a base64 string
    return jsonify({"data": encrypted_data.decode("utf-8")})


@app.route("/api/exp-date", methods=["GET"])
def exp_date():
    symbol = request.args.get("sid")
    exp = request.args.get("exp")
    return App.get_exp_date(symbol)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
