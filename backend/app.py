from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

donations_db = [
    { "id": 101, "donorId": 1, "foodType": "Rice / Grains", "quantity": 5, "status": "Safe to Donate", "score": 95 }
]

@app.route('/', methods=['GET'])
def home():
    return "SharePlate Backend is Running Successfully! 🎉"

@app.route('/api/donations', methods=['GET'])
def get_donations():
    return jsonify(donations_db)

@app.route('/api/donations', methods=['POST'])
def add_donation():
    new_donation = request.json
    new_donation['id'] = int(time.time() * 1000)
    donations_db.append(new_donation)
    return jsonify(new_donation), 201

if __name__ == '__main__':
    # host='0.0.0.0' is REQUIRED for AWS Cloud
    app.run(host='0.0.0.0', debug=True, port=5000)
