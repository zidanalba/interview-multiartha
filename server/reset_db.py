from flask import Flask
from app import db, create_app

app = create_app()

with app.app_context():
    db.drop_all()
    print("All tables dropped.")
