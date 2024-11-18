from app import create_app
from exts import db
from models import User, Role, Store, Product, Chat, Message, Attachment, ActivityLog
import uuid
from datetime import datetime

# Create Flask application instance
app = create_app()

# Define the seeding functions
def seed_roles():
    admin_role = Role(id=1, name='Admin')
    buyer_role = Role(id=2, name='Buyer')
    seller_role = Role(id=3, name='Seller')
    db.session.add_all([admin_role, buyer_role, seller_role])
    db.session.commit()

def seed_users():
    admin = User(id=str(uuid.uuid4()), password='admin', email='admin@example.com', role_id=1)
    buyer = User(id=str(uuid.uuid4()), password='buyer', email='buyer@example.com', role_id=2)
    seller = User(id=str(uuid.uuid4()), password='seller', email='seller@example.com', role_id=3)
    db.session.add_all([admin, buyer, seller])
    db.session.commit()

def seed_stores_and_products():
    store = Store(id=str(uuid.uuid4()), name="Sample Store", owner_id=3)  # seller is the store owner
    db.session.add(store)
    
    product = Product(id=str(uuid.uuid4()), name="Sample Product", price=100.0, store_id=store.id)
    db.session.add(product)
    
    db.session.commit()

def seed_chats_messages_attachments():
    # Seed chat
    chat = Chat(id=str(uuid.uuid4()), buyer_id=2, store_id="Sample Store ID")
    db.session.add(chat)
    
    # Seed messages
    message = Message(id=str(uuid.uuid4()), chat_id=chat.id, sender_id=2, content="Is this product available?")
    db.session.add(message)
    
    # Seed attachments
    attachment = Attachment(id=str(uuid.uuid4()), message_id=message.id, product_id="Sample Product ID")
    db.session.add(attachment)
    
    db.session.commit()

def seed_activity_log():
    # Seed activity log
    activity = ActivityLog(
        id=str(uuid.uuid4()),
        user_id=2,
        activity_type="message_sent",
        description="Buyer sent a message to the store.",
        created_at=datetime.utcnow()
    )
    db.session.add(activity)
    db.session.commit()

# Run all seeders
def run_seeders():
    with app.app_context():
        print("Seeding roles...")
        seed_roles()
        print("Seeding users...")
        seed_users()
        print("Seeding stores and products...")
        seed_stores_and_products()
        print("Seeding chats, messages, and attachments...")
        seed_chats_messages_attachments()
        print("Seeding activity logs...")
        seed_activity_log()
        print("Database seeded successfully!")

if __name__ == "__main__":
    run_seeders()
