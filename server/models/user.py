from flask_security import UserMixin
from exts import db
from .tables import roles_users
from datetime import datetime

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')
    roles = db.relationship('Role', secondary=roles_users, backref='roled')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    store = db.relationship('Store', back_populates='user', uselist=False)