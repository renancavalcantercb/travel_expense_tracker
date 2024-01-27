from . import db, app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512))
    expenses = db.relationship("Expense", backref="user", lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

    def to_dict(self):
        return {"id": self.id, "username": self.username, "email": self.email}


class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    description = db.Column(db.String(200))

    def __repr__(self):
        return f"<Expense {self.id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "date": self.date,
            "amount": self.amount,
            "currency": self.currency,
            "description": self.description,
        }


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    expenses = db.relationship("Expense", backref="category", lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"

    def to_dict(self):
        return {"id": self.id, "name": self.name}


with app.app_context():
    db.create_all()
