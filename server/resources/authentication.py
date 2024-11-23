from flask_restx import Resource, fields, Namespace
from sqlalchemy.exc import SQLAlchemyError
from flask import request
from models import User, TokenBlacklist
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
import traceback
from datetime import timedelta
from exts import db
import json
from logs import log_user_activity

auth_ns = Namespace("auth", description="Namespace untuk Autentikasi")

login_model = auth_ns.model(
    "Login",
    {
        'email': fields.String(required=True, description='Email of the user'),
        'password': fields.String(required=True, description='Password of the user')
    }
)

response_model = auth_ns.model('Response', {
    'message': fields.String(description='message'),
    'access_token': fields.String(description='access token'),
    'refresh_token': fields.String(description='refresh token')
})

@auth_ns.route('/login')
class LoginResource(Resource):
    @auth_ns.doc('user_login')
    @auth_ns.expect(login_model, validate=True)
    def post(self):
        """Login"""
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return {
                "message": "Email atau password tidak sesuai",
            }, 401

        log_user_activity(user.id, "Successfully logged in")

        roles = [role.name for role in user.roles]
        identity = {"id": user.id,"email": user.email, "roles": roles}
        print(identity)
        # Convert identity to a JSON string
        access_token = create_access_token(identity=json.dumps(identity))
        refresh_token = create_refresh_token(identity=json.dumps(identity))

        return {
            "message" : "Authenticated as " + str(roles),
            "access_token" : access_token,
            "refresh_token" : refresh_token,
            "id": user.id,
        }, 200

@auth_ns.route('/logout')
class LogoutResource(Resource):
    @auth_ns.doc('user_logout')
    @jwt_required()
    def post(self):
        """Logout"""
        print(get_jwt())
        jti = get_jwt()['jti']
        try:
            blacklisted_token = TokenBlacklist(JTI=jti)
            db.session.add(blacklisted_token)
            db.session.commit()
            return {
                "message": "Successfully logged out"
            }, 200
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return {
                "message": "Error logging out"
            }, 500