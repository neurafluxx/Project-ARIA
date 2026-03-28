from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from pymongo import MongoClient
import datetime
import jwt
from passlib.hash import pbkdf2_sha256
from bson import ObjectId
import json

# NEW: Correct imports for the modern Google GenAI package
from google import genai
from google.genai import types

load_dotenv(override=True)

app = Flask(__name__)
CORS(app)

# MongoDB Connection
try:
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        app.db = None
    else:
        client = MongoClient(mongodb_uri)
        db = client.get_database('aria_db')
        app.db = db
        app.users_collection = db.users
        app.reports_collection = db.reports
        print("[OK] Connected to MongoDB successfully!")
except Exception as e:
    print(f"[ERROR] MongoDB connection failed or URI missing: {e}")
    app.db = None

if app.db is None:
    print("WARNING: Using in-memory Mock MongoDB. Data will reset on server restart!")
    class MockCollection:
        def __init__(self):
            self.data = []
        def find_one(self, query):
            for doc in self.data:
                match = True
                for k, v in query.items():
                    if str(doc.get(k)) != str(v): match = False
                if match: return doc
            return None
        def insert_one(self, doc):
            doc['_id'] = ObjectId()
            self.data.append(doc)
            class Result:
                def __init__(self, id): self.inserted_id = id
            return Result(doc['_id'])
        def find(self, query):
            results = [doc for doc in self.data if all(str(doc.get(k)) == str(v) for k, v in query.items())]
            class Cursor:
                def __init__(self, res): self.res = res
                def sort(self, key, direction):
                    return sorted(self.res, key=lambda x: x.get(key, 0), reverse=(direction < 0))
            return Cursor(results)

    class MockDB:
        def __init__(self):
            self.users = MockCollection()
            self.reports = MockCollection()

    app.db = MockDB()
    app.users_collection = app.db.users
    app.reports_collection = app.db.reports

# ============= AUTH ROUTES =============

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400
        
        display_name = data.get('displayName') or email.split('@')[0]
        
        existing = app.users_collection.find_one({'email': email})
        if existing:
            return jsonify({'success': False, 'message': 'User already exists'}), 400
        
        password_hash = pbkdf2_sha256.hash(password)
        new_user = {
            "email": email,
            "password_hash": password_hash,
            "display_name": display_name,
            "created_at": datetime.datetime.utcnow()
        }
        result = app.users_collection.insert_one(new_user)
        
        token = jwt.encode(
            {
                'user_id': str(result.inserted_id),
                'email': email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
            },
            os.getenv('JWT_SECRET', 'my-secret-key'),
            algorithm='HS256'
        )
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': str(result.inserted_id),
                'email': email,
                'displayName': display_name
            }
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400
        
        user = app.users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        if pbkdf2_sha256.verify(password, user['password_hash']):
            token = jwt.encode(
                {
                    'user_id': str(user['_id']),
                    'email': email,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
                },
                os.getenv('JWT_SECRET', 'my-secret-key'),
                algorithm='HS256'
            )
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': str(user['_id']),
                    'email': user['email'],
                    'displayName': user.get('display_name', email.split('@')[0])
                }
            }), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ============= GEMINI 2.5 FLASH =============

def generate_report_with_gemini(query):
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("[ERROR] GEMINI_API_KEY not found")
            return None
        
        client = genai.Client(api_key=api_key)
        
        # Use GenerateContentConfig to ensure Gemini 2.5 Flash sends clean JSON
        config = types.GenerateContentConfig(
            response_mime_type='application/json'
        )

        # Simplified prompt to get all data in one go
        prompt = f"""Analyze market for: {query}. Return JSON exactly:
        {{
            "market": {{"market_score": 0, "cost_per_customer": "", "time_to_launch": "", "market_size": "", "growth_trends": [], "opportunities": [], "risks": [], "key_insight": ""}},
            "competitors": {{"competitors": [{{"name": "", "strength": "", "weakness": "", "position": ""}}], "gaps": [], "differentiation": ""}},
            "audience": {{"demographics": {{"age_range": "", "location": "", "income": "", "profession": ""}}, "psychographics": {{"values": [], "motivations": [], "aspirations": []}}, "pain_points": [], "buying_behavior": {{"discovery": [], "evaluation": [], "purchase": []}}}},
            "content": {{"platforms": [], "content_pillars": [], "post_ideas": [], "tone_of_voice": "", "content_mix": {{}}}}
        }}"""
        
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=prompt, 
            config=config
        )
        
        report_data = json.loads(response.text)
        report_data['_data_source'] = 'gemini'
        report_data['_generated_at'] = datetime.datetime.utcnow().isoformat()
        return report_data
    except Exception as e:
        print(f"[ERROR] Gemini API error: {e}")
        return None

def get_fallback_report(query):
    """Fallback report when Gemini fails"""
    return {
        "market": {
            "market_score": 75,
            "cost_per_customer": "$150",
            "time_to_launch": "6 mo",
            "market_size": f"Market analysis for {query}",
            "growth_trends": ["Growing demand", "Digital transformation", "Consumer awareness"],
            "opportunities": ["Untapped segments", "Innovation gap", "Partnership potential"],
            "risks": ["Competition", "Regulatory changes", "Economic factors"],
            "key_insight": f"{query} shows strong growth potential"
        },
        "competitors": {
            "competitors": [{"name": "Competitor A", "strength": "Market presence", "weakness": "High pricing", "position": "Premium"}],
            "gaps": ["Better pricing", "More features", "Better support"],
            "differentiation": "Focus on user experience and affordability"
        },
        "audience": {
            "demographics": {"age_range": "25-40", "location": "Urban areas", "income": "Middle to high", "profession": "Professionals"},
            "psychographics": {"values": ["Quality", "Innovation"], "motivations": ["Efficiency"], "aspirations": ["Success"]},
            "pain_points": ["Time consuming", "Complex solutions", "High costs"],
            "buying_behavior": {"discovery": ["Social media"], "evaluation": ["Reviews"], "purchase": ["Online"]}
        },
        "content": {
            "platforms": ["Instagram", "LinkedIn", "Twitter"],
            "content_pillars": ["Education", "Inspiration", "How-to guides"],
            "post_ideas": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
            "tone_of_voice": "Professional and friendly",
            "content_mix": {"video": "40%", "carousel": "30%", "short_form": "30%"}
        },
        "_data_source": "fallback"
    }

# ============= REPORTS ENDPOINTS =============

@app.route('/api/reports/generate', methods=['POST'])
def generate_report_endpoint():
    try:
        data = request.get_json()
        query = data.get('query')
        if not query:
            return jsonify({'success': False, 'message': 'Query required'}), 400
        
        report_data = generate_report_with_gemini(query)
        if not report_data:
            print("[WARNING] Using fallback data")
            report_data = get_fallback_report(query)
        
        report = {
            "user_id": "temp_user_123",
            "query": query,
            "created_at": datetime.datetime.utcnow(),
            **report_data
        }
        
        result = app.db.reports.insert_one(report)
        
        return jsonify({
            'success': True,
            'report': {
                'id': str(result.inserted_id),
                'query': query,
                **report_data,
                'created_at': report['created_at'].isoformat()
            }
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def get_all_reports():
    try:
        temp_user_id = "temp_user_123"
        reports = list(app.db.reports.find({'user_id': temp_user_id}).sort('created_at', -1))
        for report in reports:
            report['_id'] = str(report['_id'])
            report['created_at'] = report['created_at'].isoformat()
        return jsonify({'success': True, 'reports': reports}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_single_report(report_id):
    try:
        temp_user_id = "temp_user_123"
        report = app.db.reports.find_one({'_id': ObjectId(report_id), 'user_id': temp_user_id})
        if not report:
            return jsonify({'success': False, 'message': 'Report not found'}), 404
        report['_id'] = str(report['_id'])
        report['created_at'] = report['created_at'].isoformat()
        return jsonify({'success': True, 'report': report}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ============= BASIC ROUTES =============

@app.route('/')
def home():
    return jsonify({
        "message": "ARIA API is running",
        "version": "1.0",
        "status": "online",
        "database": "connected" if app.db is not None else "disconnected"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": "connected" if app.db is not None else "disconnected"
    })

@app.route('/api/test')
def test_api():
    api_key = os.getenv('GEMINI_API_KEY')
    return jsonify({
        "success": True,
        "message": "API is working!",
        "data": {
            "server_time": datetime.datetime.utcnow().isoformat(),
            "database_status": "connected" if app.db is not None else "disconnected",
            "gemini_api_key_configured": bool(api_key),
            "gemini_api_key_preview": api_key[:10] + "..." if api_key else None,
            "model": "gemini-2.5-flash",
            "sdk": "google-genai (new)"
        }
    })

@app.route('/api/test-gemini')
def test_gemini():
    """Test if Gemini API is working"""
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return jsonify({"success": False, "error": "GEMINI_API_KEY not configured"}), 500
        
        client = genai.Client(api_key=api_key)
        config = types.GenerateContentConfig(response_mime_type='text/plain')
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents="Say 'Gemini 2.5 Flash API is working!'",
            config=config
        )
        
        return jsonify({
            "success": True,
            "message": "Gemini 2.5 Flash API is configured correctly",
            "model": "gemini-2.5-flash",
            "sdk": "google-genai",
            "response": response.text
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
