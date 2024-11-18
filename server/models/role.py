from flask_security import RoleMixin
from exts import db
from datetime import datetime

class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)