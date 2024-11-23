from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_restx import Api
from exts import db  # Ensure this correctly initializes SQLAlchemy
from flask_migrate import Migrate
from models import *
from resources import *
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)

    # Application Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/commercealdb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'MY_SECRET'
    app.config['SECURITY_PASSWORD_SALT'] = "MY_SECRET"
    app.config['SECURITY_REGISTERABLE'] = True
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Initialize Extensions
    jwt = JWTManager(app)
    CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173", "http://localhost:5173"])

    db.init_app(app)
    migrate = Migrate(app, db)

    # API Documentation
    api = Api(app, version='1.0', title='Commerceal API Documentation', 
              description='untuk Interview dengan MUltiartha (TechforID)', 
              doc='/docs')

    # Add Namespaces
    api.add_namespace(auth_ns)
    api.add_namespace(user_ns)
    api.add_namespace(logs_ns)

    # Define a Simple Test Route
    @app.route('/foo', methods=['POST'])
    @cross_origin(origin='http://127.0.0.1:5173', headers=['Content-Type', 'Authorization'])
    def foo():
        # Access the JSON body of the request
        input_var = request.json.get('inputVar')
        if input_var:
            return jsonify({"received": input_var}), 200
        return jsonify({"error": "Missing 'inputVar' in request body"}), 400

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
