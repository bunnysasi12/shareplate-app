from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

# --- IN-MEMORY DATABASE ---
donations_db = []
users_db = [] 
otp_storage = {} 

# --- YOUR GMAIL CREDENTIALS ---
# Replace these with your actual Gmail address and 16-character App Password
GMAIL_ADDRESS = "shareplatefooddonation@gmail.com" 
GMAIL_APP_PASSWORD = "pwhqpoucfzgdflfs" 

@app.route('/', methods=['GET'])
def home():
    return "SharePlate Backend is Running Successfully! 🎉"

# --- OTP AUTHENTICATION ROUTES ---
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    
    # Generate a random 4-digit OTP
    otp = str(random.randint(1000, 9999))
    otp_storage[email] = otp 
    
    try:
        msg = MIMEText(f"Welcome to SharePlate! Your secure verification code is: {otp}")
        msg['Subject'] = 'SharePlate Verification Code'
        msg['From'] = GMAIL_ADDRESS
        msg['To'] = email
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_ADDRESS, [email], msg.as_string())
        server.quit()
        
        return jsonify({"message": "OTP sent successfully!"}), 200
    except Exception as e:
        print(f"Email Error: {e}")
        return jsonify({"error": "Failed to send email. Please check your credentials and try again."}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    user_entered_otp = data.get('otp')
    
    if otp_storage.get(email) == user_entered_otp:
        del otp_storage[email] 
        return jsonify({"message": "Verified!"}), 200
    
    return jsonify({"error": "Incorrect OTP"}), 400

# --- DONATION ROUTES ---
@app.route('/api/donations', methods=['GET'])
def get_donations():
    return jsonify(donations_db)

@app.route('/api/donations', methods=['POST'])
def add_donation():
    new_donation = request.json
    # If React didn't provide an ID, create one
    if 'id' not in new_donation:
        new_donation['id'] = int(time.time() * 1000)
    donations_db.append(new_donation)
    return jsonify(new_donation), 201

# ---> UPDATE ROUTE FOR DONATIONS (Logistics & Admin Removal) <---
@app.route('/api/donations/<int:donation_id>', methods=['PUT'])
def update_donation(donation_id):
    updated_data = request.json
    
    # Find the donation in our database and update its fields
    for i, donation in enumerate(donations_db):
        if donation.get('id') == donation_id:
            donations_db[i].update(updated_data)
            return jsonify(donations_db[i]), 200
            
    return jsonify({"error": "Donation not found"}), 404

# --- USER ROUTES ---
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(users_db)

@app.route('/api/users', methods=['POST'])
def add_user():
    new_user = request.json
    if 'id' not in new_user:
        new_user['id'] = int(time.time() * 1000)
    users_db.append(new_user)
    return jsonify(new_user), 201

# ---> UPDATE ROUTE FOR USERS (Admin Suspend/Unsuspend) <---
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    updated_data = request.json
    
    # Find the user in our database and update their fields
    for i, user in enumerate(users_db):
        if user.get('id') == user_id:
            users_db[i].update(updated_data)
            return jsonify(users_db[i]), 200
            
    return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    # host='0.0.0.0' is REQUIRED for AWS Cloud so it accepts incoming internet traffic
    app.run(host='0.0.0.0', debug=True, port=5000)