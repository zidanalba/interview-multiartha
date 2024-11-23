from flask_restx import Namespace, Resource, fields, reqparse
from flask import request
from models import ActivityLog

logs_ns = Namespace('logs', description='User Activity Logs API')

log_model = logs_ns.model('Log', {
    'id': fields.String,
    'user_id': fields.Integer,
    'activity': fields.String,
    'timestamp': fields.DateTime,
    'ip_address': fields.String,
    'user_agent': fields.String,
})

response_model = logs_ns.model('Log Response', {
    'total' : fields.Integer,
    'page': fields.Integer,
    'per_page': fields.Integer,
    'data': fields.List(fields.Nested(log_model))
})

pagination_parser = reqparse.RequestParser()
pagination_parser.add_argument('page', type=int, required=False, default=1, help='Page number')
pagination_parser.add_argument('per_page', type=int, required=False, default=10, help='Number of items per page')
@logs_ns.route('/')
class LogsResource(Resource):
    @logs_ns.marshal_with(response_model, as_list=True)
    def get(self):
        """
        Retrieve paginated user activity logs
        """
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        query = ActivityLog.query.paginate(page=page, per_page=per_page)

        return {
            "total": query.total,
            "page": query.page,
            "per_page": query.per_page,
            "data": [log for log in query.items]
        }
