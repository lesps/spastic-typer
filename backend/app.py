import os
import re
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-prod')

CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    mbti_type = db.Column(db.String(4), nullable=True)
    enn_type = db.Column(db.Integer, nullable=True)
    enn_wing = db.Column(db.Integer, nullable=True)
    enn_instinct = db.Column(db.String(2), nullable=True)
    enn_wing_strength = db.Column(db.String(10), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


with app.app_context():
    db.create_all()


def make_token(user_id, username):
    payload = {
        'sub': user_id,
        'username': username,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


def require_auth():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None, ('Missing token', 401)
    token = auth[7:]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, ('Token expired', 401)
    except jwt.InvalidTokenError:
        return None, ('Invalid token', 401)


def validate_username(username):
    return bool(re.match(r'^[a-zA-Z0-9_]{3,30}$', username))


def profile_dict(user):
    return {
        'username': user.username,
        'mbti_type': user.mbti_type,
        'enn_type': user.enn_type,
        'enn_wing': user.enn_wing,
        'enn_instinct': user.enn_instinct,
        'enn_wing_strength': user.enn_wing_strength,
    }


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not validate_username(username):
        return jsonify({'error': 'Username must be 3–30 characters (letters, numbers, underscores)'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 409

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(username=username, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()

    token = make_token(user.id, user.username)
    return jsonify({'token': token, 'username': user.username}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return jsonify({'error': 'Invalid username or password'}), 401

    token = make_token(user.id, user.username)
    return jsonify({'token': token, 'username': user.username})


@app.route('/profile/me', methods=['GET'])
def get_my_profile():
    payload, err = require_auth()
    if err:
        return jsonify({'error': err[0]}), err[1]
    user = db.session.get(User, payload['sub'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(profile_dict(user))


@app.route('/profile/me', methods=['PUT'])
def update_my_profile():
    payload, err = require_auth()
    if err:
        return jsonify({'error': err[0]}), err[1]
    user = db.session.get(User, payload['sub'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json(silent=True) or {}

    VALID_MBTI = {'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
                  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'}
    VALID_INSTINCT = {'sp', 'sx', 'so'}
    VALID_WING_STRENGTH = {'balanced', 'moderate', 'strong'}

    if 'mbti_type' in data:
        v = data['mbti_type']
        if v is not None and v not in VALID_MBTI:
            return jsonify({'error': 'Invalid MBTI type'}), 400
        user.mbti_type = v

    if 'enn_type' in data:
        v = data['enn_type']
        if v is not None and v not in range(1, 10):
            return jsonify({'error': 'Enneagram type must be 1–9'}), 400
        user.enn_type = v

    if 'enn_wing' in data:
        v = data['enn_wing']
        if v is not None and v not in range(1, 10):
            return jsonify({'error': 'Wing must be 1–9'}), 400
        user.enn_wing = v

    if 'enn_instinct' in data:
        v = data['enn_instinct']
        if v is not None and v not in VALID_INSTINCT:
            return jsonify({'error': 'Instinct must be sp, sx, or so'}), 400
        user.enn_instinct = v

    if 'enn_wing_strength' in data:
        v = data['enn_wing_strength']
        if v is not None and v not in VALID_WING_STRENGTH:
            return jsonify({'error': 'Wing strength must be balanced, moderate, or strong'}), 400
        user.enn_wing_strength = v

    db.session.commit()
    return jsonify(profile_dict(user))


@app.route('/profile/<username>', methods=['GET'])
def get_user_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(profile_dict(user))


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
