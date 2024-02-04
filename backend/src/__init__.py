from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from os import environ

import sys
import os
import redis

sys.path.append(os.getcwd())

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DATABASE_URL")
app.config["SECRET_KEY"] = environ.get("SECRET_KEY")
app.config["REDIS_URL"] = environ.get("REDIS_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)
redis_client = redis.Redis.from_url(app.config["REDIS_URL"])

with app.app_context():
    db.create_all()

from src.routes import *
