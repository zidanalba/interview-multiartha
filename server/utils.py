# utils.py
import uuid
import os
import traceback
from flask import current_app as app
from werkzeug.utils import secure_filename
from flask_restx import fields
from datetime import datetime, date, timedelta

def generate_uuid():
    return str(uuid.uuid4())

def parse_date(date_str):
    if date_str:
        try:
            # Attempt to parse with datetime format first
            return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        except ValueError:
            try:
                # Attempt to parse with datetime format (no microseconds)
                return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')
            except ValueError:
                try:
                    # Attempt to parse with date format (no time)
                    return datetime.strptime(date_str, '%Y-%m-%d')
                except ValueError:
                    try:
                        # Attempt to parse with date format (no time, different separator)
                        return datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
                    except ValueError:
                        raise ValueError(f"Unsupported date format: {date_str}")
    return None

def convert_dates_to_strings(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (date, datetime)):
                data[key] = value.isoformat()
            elif isinstance(value, list):
                data[key] = [convert_dates_to_strings(item) for item in value]
        return data
    elif isinstance(data, (date, datetime)):
        return data.isoformat()
    elif isinstance(data, list):
        return [convert_dates_to_strings(item) for item in data]
    else:
        return data

class NullableString(fields.String):
    __schema_type__ = ['string', 'null']
    __schema_example__ = 'nullable string'

def handle_uploaded_file(file_data, field_name, organisasi):
    """Helper function to handle uploaded file"""
    try:
        upload_folder = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], 'profil-organisasi')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        # Delete previous file if it exists
        existing_file_name = getattr(organisasi, field_name)
        if existing_file_name:
            existing_file_path = os.path.join(upload_folder, existing_file_name)
            if os.path.exists(existing_file_path):
                os.remove(existing_file_path)

        # Save new file
        if file_data:
            filename = secure_filename(file_data.filename)
            file_path = os.path.join(upload_folder, filename)
            file_data.save(file_path)
            # Save file name to the database
            setattr(organisasi, field_name, filename)
    except Exception as e:
        traceback.print_exc()
        raise e
