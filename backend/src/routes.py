from src import app
from flask import request, jsonify
from .models import User, Expense, Category
from . import db

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

    if (
        User.query.filter_by(username=username).first()
        or User.query.filter_by(email=email).first()
    ):
        return jsonify({"message": "Username or email already exists"}), 400

    new_user = User(username=username, email=email, password_hash=password)
    db.session.add(new_user)
    db.session.commit()

    return (
        jsonify({"message": "User created successfully", "user": new_user.to_dict()}),
        201,
    )


@app.route(f"{BASE_URL}/expenses/<int:user_id>", methods=["GET"])
def get_expenses(user_id):
    expenses = Expense.query.filter_by(user_id=user_id).all()
    if expenses:
        return jsonify([expense.to_dict() for expense in expenses]), 200
    return jsonify({"message": "No expenses found.", "status": 404}), 404


@app.route(f"{BASE_URL}/expenses/<int:user_id>", methods=["POST"])
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


@app.route(f"{BASE_URL}/categories/<int:user_id>", methods=["POST"])
def create_category(user_id):
    data = request.get_json()
    name = data.get("name")
    if Category.query.filter_by(name=name).first():
        return jsonify({"message": "Category already exists"}), 400
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return (
        jsonify(
            {
                "message": "Category created successfully",
                "category": new_category.to_dict(),
            }
        ),
        201,
    )
