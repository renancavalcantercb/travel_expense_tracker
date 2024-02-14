from flask import request, jsonify
from functools import wraps
from src import app, redis_client
from ..models import User
import jwt


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])

            redis_key = f"token:{token}"
            if not redis_client.exists(redis_key):
                raise Exception("Token is not valid or has expired")

            stored_user_id = redis_client.hget(redis_key, "user_id").decode("utf-8")
            if str(current_user.id) != stored_user_id:
                raise Exception("Token does not belong to the user")

        except Exception as e:
            return jsonify({"message": str(e)}), 403

        return f(*args, **kwargs)

    return decorated_function
