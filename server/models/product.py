from exts import db
from datetime import datetime
from sqlalchemy import Numeric

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(Numeric(10, 2), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    store_id = db.Column(db.String(36), db.ForeignKey('stores.id'), nullable=False)
    store = db.relationship('Store', back_populates='products')