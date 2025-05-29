from flask import Flask, request, jsonify
from pymongo import MongoClient
import bcrypt
import os
import sys
import logging
from dotenv import load_dotenv
from flask_cors import CORS
import datetime
from bson import json_util
from bson.objectid import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route('/')
def index():
    return 'API is running. Welcome to Police App!'


# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    logging.error("MONGODB_URI not set in .env")
    print("MONGODB_URI not set in .env")
    sys.exit(1)

try:
    client = MongoClient(MONGODB_URI)
    client.admin.command('ping')  # Test connection
    db = client['criminal_record']
    police_collection = db['police']
    records_collection = db['criminal_record']
    logging.info("Successfully connected to MongoDB")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {str(e)}")
    print(f"Failed to connect to MongoDB: {str(e)}")
    sys.exit(1)

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logging.info(f"Received registration data: {data}")
        police_id = data.get('policeId')
        police_name = data.get('policeName')
        department = data.get('department')
        police_address = data.get('policeAddress')
        designation = data.get('designation')
        password = data.get('password')

        if not all([police_id, police_name, department, police_address, designation, password]):
            logging.error("Validation failed: All fields are required")
            return jsonify({"error": "All fields are required"}), 400

        if police_collection.find_one({"policeId": police_id}):
            logging.error(f"Police ID {police_id} already exists")
            return jsonify({"error": "Police ID already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        logging.info("Password hashed successfully")

        police_collection.insert_one({
            "policeId": police_id,
            "policeName": police_name,
            "department": department,
            "policeAddress": police_address,
            "designation": designation,
            "password": hashed_password,
            "createdAt": datetime.datetime.utcnow()
        })
        logging.info(f"User {police_id} registered successfully")
        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logging.info(f"Received login data: {data}")  # Debug log
        police_name = data.get('policeName')
        password = data.get('password')

        # Validate input
        if not all([police_name, password]):
            logging.error("Validation failed: Police Name and Password are required")
            return jsonify({"error": "Police Name and Password are required"}), 400

        # Find user
        user = police_collection.find_one({"policeName": police_name})
        if not user:
            logging.error(f"Login failed: Invalid Police Name {police_name}")
            return jsonify({"error": "Invalid Police Name or Password"}), 401

        # Verify password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            logging.info(f"User {police_name} logged in successfully")
            return jsonify({"message": "Login successful", "policeId": user['policeId']}), 200
        else:
            logging.error(f"Login failed: Invalid password for {police_name}")
            return jsonify({"error": "Invalid Police Name or Password"}), 401

    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/getRecords")
def getRecords():
    try:
        query = request.args.get("query")

        if not query or query == "null" or query == "":
            records_cursor = records_collection.find()
        else:
            records_cursor = records_collection.find({"c_id": {"$regex": f"^{query}"}})

        records_list = list(records_cursor)
        
        return json_util.dumps({
            "data": records_list
        }), 200

    except Exception as e:
        logging.error(f"Get Records error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/addRecord", methods=['POST'])
def addRecord():
    try:
        data = request.get_json()

        if data['create']:
            records_collection.insert_one(data['data'])
        else:
            records_collection.update_one({ "c_id": data['data']['c_id'] }, {'$set': data['data']})
        
        return json_util.dumps({
            "status": 200
        }), 200

    except Exception as e:
        logging.error(f"Get Records error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/deleteRecord", methods=['DELETE'])
def deleteRecord():
    try:
        c_id = request.args.get("c_id")

        if not c_id:
            return jsonify({"error": "Internal server error"}), 500
        else:
            records_collection.delete_one({ "c_id": c_id })
        
        return json_util.dumps({
            "status": 200
        }), 200

    except Exception as e:
        logging.error(f"Get Records error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
 
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)