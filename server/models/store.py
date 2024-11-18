from exts import db
from datetime import datetime

class Store(db.Model):
    __tablename__ = 'stores'
    id = db.Column(db.String(36), primary_key=True)
    store_username = db.Column(db.String, unique=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship('Product', back_populates='store', cascade="all, delete")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    user = db.relationship('User', back_populates='store')