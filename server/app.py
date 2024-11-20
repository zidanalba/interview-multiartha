from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restx import Api
from exts import db  # Ensure this correctly initializes SQLAlchemy
from flask_migrate import Migrate
from models import *
from resources import *
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/commercealdb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'MY_SECRET'
    app.config['SECURITY_PASSWORD_SALT'] = "MY_SECRET"
    app.config['SECURITY_REGISTERABLE'] = True
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False

    jwt = JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
    db.init_app(app)

    api = Api(app, version='1.0', title='Commerceal API Documentation', 
              description='untuk Interview dengan MUltiartha (TechforID)', 
              doc='/docs')

    api.add_namespace(auth_ns)
    api.add_namespace(user_ns)

    migrate = Migrate(app, db)

    return app
