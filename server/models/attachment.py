from exts import db

class Attachment(db.Model):
    __tablename__ = "attachments"
    id = db.Column(db.String(36), primary_key=True)
    message_id = db.Column(db.String(36), db.ForeignKey('messages.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=True)

    message = db.relationship('Message', backref='attachment')
    product = db.relationship('Product', backref='attachments', lazy=True)