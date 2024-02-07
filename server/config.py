import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import bcrypt

secret_key = os.environ.get('SECRET_KEY')
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://frankdillon:KKwsChm5QXtAldBrcskxpyNaIcred0lw@dpg-cmopuficn0vc73cj36s0-a.ohio-postgres.render.com/full_stack_project_7adg'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key
app.json.compact = False
bcrypt = bcrypt
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

CORS(app)
