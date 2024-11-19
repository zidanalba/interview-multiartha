from app import create_app
from exts import db
from models import User, Role, Store, Product, Chat, Message, Attachment, ActivityLog
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash

# Create Flask application instance
app = create_app()

# Define the seeding functions
def seed_roles():
    # Create roles
    admin_role = Role( name='Admin')
    buyer_role = Role( name='Buyer')
    seller_role = Role( name='Seller')
    db.session.add_all([admin_role, buyer_role, seller_role])
    db.session.commit()

def seed_users():
    # Create users and associate roles
    admin = User(email='admin@example.com', password=generate_password_hash('admin'))
    buyer = User(email='buyer@example.com', password=generate_password_hash('buyer'))
    seller = User(email='seller@example.com', password=generate_password_hash('seller'))

    # Assign roles to users
    admin.roles.append(Role.query.filter_by(name='Admin').first())
    buyer.roles.append(Role.query.filter_by(name='Buyer').first())
    seller.roles.append(Role.query.filter_by(name='Seller').first())

    # Add and commit users
    db.session.add_all([admin, buyer, seller])
    db.session.commit()

    print(f"Seller user created with ID: {seller.id}")


def seed_stores_and_products():
    # Retrieve the seller user from the database
    seller = User.query.filter_by(email='seller@example.com').first()

    if not seller:
        print("Seller user not found. Ensure users are seeded before stores and products.")
        return

    # Seed store and product
    store = Store(
        id=str(uuid.uuid4()), 
        name="Sample Store", 
        store_username="sampleStore", 
        user_id=seller.id  # Use seller's ID
    )
    db.session.add(store)

    product = Product(
        id=str(uuid.uuid4()), 
        name="Sample Product", 
        price=100.0, 
        store_id=store.id
    )
    db.session.add(product)
    
    db.session.commit()

    print(f"Store and product seeded successfully. Store owner ID: {seller.id}")


# def seed_chats_messages_attachments():
#     # Seed chat
#     chat = Chat(id=str(uuid.uuid4()), buyer_id=2, store_id=)
#     db.session.add(chat)
    
#     # Seed messages
#     message = Message(id=str(uuid.uuid4()), chat_id=chat.id, sender_id=2, content="Is this product available?")
#     db.session.add(message)
    
#     # Seed attachments
#     attachment = Attachment(id=str(uuid.uuid4()), message_id=message.id, product_id="Sample Product ID")
#     db.session.add(attachment)
    
#     db.session.commit()

# def seed_activity_log():
#     # Seed activity log
#     activity = ActivityLog(
#         id=str(uuid.uuid4()),
#         user_id=2,
#         activity_type="message_sent",
#         description="Buyer sent a message to the store.",
#         created_at=datetime.utcnow()
#     )
#     db.session.add(activity)
#     db.session.commit()

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
        # seed_chats_messages_attachments()
        # print("Seeding activity logs...")
        # seed_activity_log()
        # print("Database seeded successfully!")

if __name__ == "__main__":
    run_seeders()
