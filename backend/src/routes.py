import jwt
from src import app
from flask import request, jsonify
from .models import User, Expense, Category
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from . import db, redis_client
from .decorators.token_decorator import token_required

BASE_URL = "/api/v1"


@app.route(f"{BASE_URL}/")
def index():
    return jsonify({"message": "Welcome to the API!", "status": 200}), 200


@app.route(f"{BASE_URL}/users/create", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    print(data)
    if (
        User.query.filter_by(username=username).first()
        or User.query.filter_by(email=email).first()
    ):
        return jsonify({"message": "Username or email already exists"}), 400

    new_user = User(
        username=username, email=email, password_hash=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()

    return (
        jsonify({"message": "User created successfully", "user": new_user.to_dict()}),
        201,
    )


@app.route(f"{BASE_URL}/users/login", methods=["POST"])
def login_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid username or password"}), 401
    
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }

    token_data = {
        "user_id": user.id,
        "username": user.username,
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    token = jwt.encode(token_data, app.config["SECRET_KEY"], algorithm="HS256")

    redis_key = f"token:{token}"
    redis_value = {"user_id": str(user.id), "exp": str(token_data["exp"].timestamp())}
    redis_client.hmset(redis_key, redis_value)
    redis_client.expireat(redis_key, int(token_data["exp"].timestamp()))

    return jsonify({"message": "Login successful", "token": token, "user_data": user_data}), 200


@app.route(f"{BASE_URL}/expenses/<int:user_id>", methods=["GET"])
@token_required
def get_expenses(user_id):
    expenses = Expense.query.filter_by(user_id=user_id).all()
    if expenses:
        return jsonify([expense.to_dict() for expense in expenses]), 200
    return jsonify({"message": "No expenses found.", "status": 404}), 404


@app.route(f"{BASE_URL}/expenses/create/<int:user_id>", methods=["POST"])
@token_required
def create_expense(user_id):
    data = request.get_json()
    category = Category.query.filter_by(name=data.get("category")).first()
    if not category:
        category = Category(name=data.get("category"))
        db.session.add(category)
        db.session.commit()
    new_expense = Expense(
        user_id=user_id,
        category_id=category.id,
        date=data.get("date"),
        amount=data.get("amount"),
        currency=data.get("currency"),
        description=data.get("description"),
    )
    db.session.add(new_expense)
    db.session.commit()
    return (
        jsonify(
            {
                "message": "Expense created successfully",
                "expense": new_expense.to_dict(),
            }
        ),
        201,
    )


@app.route(f"{BASE_URL}/expenses/edit/<int:expense_id>", methods=["PUT"])
@token_required
def update_expense(expense_id):
    data = request.get_json()
    expense = Expense.query.filter_by(id=expense_id).first()
    if not expense:
        return jsonify({"message": "Expense not found"}), 404
    expense.date = data.get("date")
    expense.amount = data.get("amount")
    expense.currency = data.get("currency")
    expense.description = data.get("description")
    db.session.commit()
    return (
        jsonify(
            {
                "message": "Expense updated successfully",
                "expense": expense.to_dict(),
            }
        ),
        200,
    )


@app.route(f"{BASE_URL}/expenses/delete/<int:expense_id>", methods=["DELETE"])
@token_required
def delete_expense(expense_id):
    expense = Expense.query.filter_by(id=expense_id).first()
    if not expense:
        return jsonify({"message": "Expense not found"}), 404
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted successfully"}), 200


@app.route(f"{BASE_URL}/categories", methods=["GET"])
@token_required
def get_categories():
    categories = Category.query.all()
    if categories:
        return jsonify([category.to_dict() for category in categories]), 200
    return jsonify({"message": "No categories found.", "status": 404}), 404
