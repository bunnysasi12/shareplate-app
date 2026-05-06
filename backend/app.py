from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# Databases (Memory-based for now)
donations_db = []
users_db = [] # <-- NEW: Added global user storage

@app.route('/', methods=['GET'])
def home():
    return "SharePlate Backend is Running Successfully! 🎉"

# --- DONATION ROUTES ---
@app.route('/api/donations', methods=['GET'])
def get_donations():
    return jsonify(donations_db)

@app.route('/api/donations', methods=['POST'])
def add_donation():
    new_donation = request.json
    new_donation['id'] = int(time.time() * 1000)
    donations_db.append(new_donation)
    return jsonify(new_donation), 201

# --- NEW: USER ROUTES ---
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(users_db)

@app.route('/api/users', methods=['POST'])
def add_user():
    new_user = request.json
    users_db.append(new_user)
    return jsonify(new_user), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)