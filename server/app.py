from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restx import Api
from exts import db, seeder  # Ensure this correctly initializes SQLAlchemy
from flask_migrate import Migrate
from models import *

def create_app():
    app = Flask(__name__)

    # path to sqlite database
    # this will create the db file in instance
    # if database not present already
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/commercealdb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # needed for session cookies
    app.config['SECRET_KEY'] = 'MY_SECRET'
    # hashes the password and then stores in the database
    app.config['SECURITY_PASSWORD_SALT'] = "MY_SECRET"
    # allows new registrations to application
    app.config['SECURITY_REGISTERABLE'] = True
    # to send automatic registration email to user
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False

    CORS(app)
    db.init_app(app)

    api = Api(app, version='1.0', title='Commerceal API Documentation', 
              description='untuk Interview dengan MUltiartha (TechforID)', 
              doc='/docs')

    migrate = Migrate(app, db)

    return app
