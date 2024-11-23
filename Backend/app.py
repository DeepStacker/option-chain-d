from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_compress import Compress
from prometheus_flask_exporter import PrometheusMetrics
from APIs import App
import logging
from functools import wraps
import time
from Urls import Urls

# Enhanced logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='app.log'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize caching
cache = Cache(app, config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 300
})

# Initialize rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["5000 per day", "1000 per hour"]
)

# Initialize compression
Compress(app)

# Initialize metrics
metrics = PrometheusMetrics(app)

# Request timing middleware
def timing_middleware(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        start = time.time()
        try:
            response = f(*args, **kwargs)
        finally:
            end = time.time()
            duration = (end - start) * 1000  # Convert to milliseconds
            logger.info(f"Request to {request.path} completed in {duration:.2f} ms")
        return response
    return wrap

# Explicitly allow localhost:5173
CORS(
    app,
    resources={r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://192.168.56.1:5173",
            "https://stockify-oc.vercel.app",
            "https://stockify-oc.onrender.com",
        ]
    }}
)

@app.route("/api/live-data/", methods=["GET"])
@limiter.limit("30 per minute")
@cache.cached(timeout=30, query_string=True)
@timing_middleware
def live_data():
    symbol = request.args.get("sid")
    exp = request.args.get("exp")
    try:
        if not symbol or not exp:
            logger.error("Missing required parameters: symbol=%s, exp=%s", symbol, exp)
            return jsonify({"error": "Missing required parameters"}), 400

        if symbol not in Urls.symbol_list:
            logger.error("Invalid symbol: %s", symbol)
            return jsonify({"error": "Invalid or missing 'sid' parameter"}), 400

        symbol_id = Urls.symbol_list[symbol]
        seg_id = Urls.seg_list[symbol]

        try:
            exp = int(exp)
        except (ValueError, TypeError):
            logger.error("Invalid exp value: %s", exp)
            return jsonify({"error": "'exp' must be a valid integer"}), 400

        logger.info("Fetching data for symbol=%s, exp=%s, seg=%s", symbol_id, exp, seg_id)
        option_data, spot_data, fut_data = Urls.fetch_data(symbol_id, exp, seg_id)

        if option_data is None or spot_data is None:
            logger.error("Failed to fetch data from API")
            return jsonify({"error": "Failed to fetch data from API"}), 500

        response = {
            "symbol": symbol_id,
            "expiry": exp,
            "options": option_data,
            "spot": spot_data,
            "fut": fut_data,
        }
        logger.info("Successfully retrieved data for symbol=%s", symbol)
        return jsonify(response)

    except Exception as e:
        logger.error("Error in /api/live-data/: %s", str(e), exc_info=True)
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/exp-date/", methods=["GET"])
@limiter.limit("30 per minute")
@cache.cached(timeout=300, query_string=True)
@timing_middleware
def exp_date():
    symbol = request.args.get("sid")
    try:
        if not symbol:
            return jsonify({"error": "Missing required parameters"}), 400

        response = App.get_exp_date(symbol)
        if response is None:
            return jsonify({"error": "Data not found"}), 404
        return response
    except Exception as e:
        logger.error(f"Error in /api/exp-date/: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/percentage-data/", methods=["POST"])
@limiter.limit("30 per minute")
@timing_middleware
def percentage_data():
    """Endpoint to get percentage data based on strike price."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    symbol = data.get("sid")
    exp = data.get("exp")
    isCe = data.get("isCe")
    strike = data.get("strike")

    if not all([symbol, exp, strike]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        response, status_code = App.get_percentage_data(symbol, exp, isCe, strike)
        if response is None:
            return jsonify({"error": "Data not found"}), 404
        return response, status_code
    except Exception as e:
        logger.error(f"Error in /api/percentage-data/: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/iv-data/", methods=["POST"])
@limiter.limit("30 per minute")
@timing_middleware
def iv_data():
    """Endpoint to get iv data based on strike price."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    symbol = data.get("sid")
    exp = data.get("exp")
    isCe = data.get("isCe")
    strike = data.get("strike")

    if not all([symbol, exp, strike]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        response, status_code = App.get_iv_data(symbol, exp, isCe, strike)
        if response is None:
            return jsonify({"error": "Data not found"}), 404
        return response, status_code
    except Exception as e:
        logger.error(f"Error in /api/iv-data/: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/delta-data/", methods=["POST"])
@limiter.limit("30 per minute")
@timing_middleware
def delta_data():
    """Endpoint to get delta data based on strike price."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    symbol = data.get("sid")
    exp = data.get("exp")
    strike = data.get("strike")

    if not all([symbol, exp, strike]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        response, status_code = App.get_delta_data(symbol, exp, strike)
        if response is None:
            return jsonify({"error": "Data not found"}), 404
        return response, status_code
    except Exception as e:
        logger.error(f"Error in /api/delta-data/: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/fut-data/", methods=["POST"])
@limiter.limit("30 per minute")
@timing_middleware
def fut_data():
    """Endpoint to get fut data based on expiration date."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    symbol = data.get("sid")
    exp = data.get("exp")

    if not all([symbol, exp]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        response, status_code = App.get_fut_data(symbol, exp)
        if response is None:
            return jsonify({"error": "Data not found"}), 404
        return response, status_code
    except Exception as e:
        logger.error(f"Error in /api/fut-data/: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/*", methods=["OPTIONS"])
def handle_options():
    return "", 200  # Respond with status 200 for OPTIONS requests

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded", "message": str(e.description)}), 429

@app.errorhandler(500)
def internal_error(e):
    logger.error(f"Internal Server Error: {str(e)}")
    return jsonify({"error": "Internal Server Error"}), 500

# if __name__ == "__main__":
#     app.run(debug=True, threaded=True)