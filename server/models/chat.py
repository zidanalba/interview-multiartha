from exts import db
from datetime import datetime

class Chat(db.Model):
    __tablename__ = 'chats'
    id = db.Column(db.String(36), primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    store_id = db.Column(db.String(36), db.ForeignKey('stores.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    buyer = db.relationship('User', foreign_keys=[buyer_id], backref='chats_as_buyer')
    store = db.relationship('Store', foreign_keys=[store_id], backref='chats_as_store')
