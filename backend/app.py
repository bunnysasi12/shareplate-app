from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

donations_db = []
users_db = [] 
otp_storage = {} # NEW: Stores generated OTPs temporarily

# --- YOUR GMAIL CREDENTIALS ---
GMAIL_ADDRESS = "bunnysasi00@gmail.com" # Put your email here
GMAIL_APP_PASSWORD = "gpqgqfyqrnaurifc" # Put the Google App Password here (no spaces)

@app.route('/', methods=['GET'])
def home():
    return "SharePlate Backend is Running Successfully! 🎉"

# --- NEW: OTP ROUTES ---
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    
    # Generate a random 4-digit OTP
    otp = str(random.randint(1000, 9999))
    otp_storage[email] = otp # Save it to check later
    
    try:
        # Build the email
        msg = MIMEText(f"Welcome to SharePlate! Your email verification code is: {otp}")
        msg['Subject'] = 'SharePlate Verification Code'
        msg['From'] = GMAIL_ADDRESS
        msg['To'] = email
        
        # Send the email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_ADDRESS, [email], msg.as_string())
        server.quit()
        
        return jsonify({"message": "OTP sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to send email. Check credentials."}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    user_entered_otp = data.get('otp')
    
    # Check if it matches our saved OTP
    if otp_storage.get(email) == user_entered_otp:
        del otp_storage[email] # Security: delete after successful use
        return jsonify({"message": "Verified!"}), 200
    
    return jsonify({"error": "Incorrect OTP"}), 400

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

# --- USER ROUTES ---
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