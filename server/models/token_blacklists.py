from exts import db
from datetime import datetime

class TokenBlacklist(db.Model):
    __tablename__='token_blacklists'

    TOKEN_ID = db.Column(db.Integer, primary_key=True)
    JTI = db.Column(db.String(36), nullable=False, unique=True)
    CREATED_AT = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
