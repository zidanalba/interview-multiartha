from flask_restx import Resource, fields, Namespace, reqparse
from sqlalchemy.exc import SQLAlchemyError
from flask import request
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Role
from exts import db
from utils import generate_uuid
import traceback
import json

user_ns = Namespace("user", description="Namespace for managing users")

user_model = user_ns.model(
    "User",
    {
        'roles': fields.List(fields.String, description='List of Role Names', required=True),
        'email': fields.String(required=True, description='User email'),
    }
)

user_list_model = user_ns.model(
    "User List",
    {
        'id': fields.Integer(description='User ID'),
        'roles': fields.List(fields.String, description='List of Role Names', required=True),
        'email': fields.String(required=True, description='User email'),
    }
)

pagination_model = user_ns.model('Pagination', {
    'message': fields.String(),
    'total': fields.Integer(description='Total number of users'),
    'pages': fields.Integer(description='Total number of pages'),
    'current_page': fields.Integer(description='Current page number'),
    'per_page': fields.Integer(description='Number of users per page'),
    'data': fields.List(fields.Nested(user_list_model), description='List of users'),
})

response_model = user_ns.model('Response', {
    'message': fields.String(description='Response message'),
    'data': fields.Nested(user_model, description='User data'),
})

pagination_parser = reqparse.RequestParser()
pagination_parser.add_argument('page', type=int, required=False, default=1, help='Page number')
pagination_parser.add_argument('per_page', type=int, required=False, default=10, help='Users per page')
pagination_parser.add_argument('search', type=str, required=False, help='Search term for email')
pagination_parser.add_argument('role', type=str, action='append', required=False, help='Role filter')


@user_ns.route('/')
class UsersResource(Resource):
    @user_ns.doc('create_user')
    @user_ns.expect(user_model, validate=True)
    @user_ns.marshal_with(response_model, code=201)
    @jwt_required()
    def post(self):
        """Create a new user"""
        current_user = json.loads(get_jwt_identity())
        user_roles = current_user.get('roles', [])

        if 'Admin' not in user_roles:
            return {"message": "Access denied. Admins only."}, 403

        data = request.get_json()
        try:
            new_user = User(
                email=data['email'],
                password=generate_password_hash("password")
            )

            if 'roles' in data:
                roles = Role.query.filter(Role.name.in_(data['roles'])).all()
                new_user.roles.extend(roles)

            db.session.add(new_user)
            db.session.commit()

            return {
                'message': 'User created successfully',
                'data': {
                    'id': new_user.id,
                    'email': new_user.email,
                    'roles': [role.name for role in new_user.roles],
                }
            }, 201

        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return {'message': f"Error occurred: {str(e)}"}, 500

    @user_ns.doc('get_all_users')
    @user_ns.expect(pagination_parser)
    @user_ns.marshal_with(pagination_model)
    @jwt_required()
    def get(self):
        """Get all users with pagination and filters"""
        current_user = json.loads(get_jwt_identity())
        user_roles = current_user.get('roles', [])

        if 'Admin' not in user_roles:
            return {"message": "Access denied. Admins only."}, 403

        args = pagination_parser.parse_args()
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)
        search = args.get('search')
        role_filters = args.get('role')

        try:
            query = User.query

            if search:
                query = query.filter(User.email.ilike(f'%{search}%'))

            if role_filters:
                query = query.filter(User.roles.any(Role.name.in_(role_filters)))

            pagination = query.paginate(page=page, per_page=per_page, error_out=False)

            users = [
                {
                    'id': user.id,
                    'email': user.email,
                    'roles': [role.name for role in user.roles],
                } for user in pagination.items
            ]

            return {
                'message': 'Users retrieved successfully',
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': pagination.page,
                'per_page': pagination.per_page,
                'data': users,
            }, 200

        except Exception as e:
            traceback.print_exc()
            return {'message': f"Error occurred: {str(e)}"}, 500


@user_ns.route('/<int:id>')
class UserResource(Resource):
    @user_ns.marshal_with(response_model, code=200)
    @jwt_required()
    def get(self, id):
        """Get a single user by ID"""
        current_user = json.loads(get_jwt_identity())
        user_roles = current_user.get('roles', [])

        if 'Admin' not in user_roles:
            return {"message": "Access denied. Admins only."}, 403
        try:
            user = User.query.get_or_404(id)
            return {
                'message': 'User retrieved successfully',
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'roles': [role.name for role in user.roles],
                }
            }, 200
        except Exception as e:
            traceback.print_exc()
            return {'message': f"Error occurred: {str(e)}"}, 500

    @user_ns.marshal_with(response_model, code=200)
    @user_ns.expect(user_model)
    @jwt_required()
    def put(self, id):
        """Update an existing user"""
        current_user = json.loads(get_jwt_identity())
        user_roles = current_user.get('roles', [])

        if 'Admin' not in user_roles:
            return {"message": "Access denied. Admins only."}, 403

        try:
            user = User.query.get_or_404(id)
            data = request.get_json()

            if 'email' in data:
                user.email = data['email']

            if 'roles' in data:
                roles = Role.query.filter(Role.name.in_(data['roles'])).all()
                user.roles = roles

            db.session.commit()

            return {
                'message': 'User updated successfully',
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'roles': [role.name for role in user.roles],
                }
            }, 200
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return {'message': f"Error occurred: {str(e)}"}, 500

    @user_ns.doc('delete_user')
    @jwt_required()
    def delete(self, id):
        """Delete a user"""
        current_user = json.loads(get_jwt_identity())
        user_roles = current_user.get('roles', [])

        if 'Admin' not in user_roles:
            return {"message": "Access denied. Admins only."}, 403

        try:
            user = User.query.get_or_404(id)
            db.session.delete(user)
            db.session.commit()
            return {'message': f'User with ID {id} deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return {'message': f"Error occurred: {str(e)}"}, 500
