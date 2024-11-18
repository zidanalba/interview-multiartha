from exts import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.String(36), primary_key=True)
    chat_id = db.Column(db.String(36), db.ForeignKey('chats.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    chat = db.relationship('Chat', backref='messages')
    sender = db.relationship('User', backref='sent_messages')
