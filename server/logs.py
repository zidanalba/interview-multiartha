from flask import request
from models import ActivityLog
from exts import db

def log_user_activity(user_id, activity):
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent')
    log = ActivityLog(
        user_id=user_id,
        activity=activity,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.session.add(log)
    db.session.commit()
