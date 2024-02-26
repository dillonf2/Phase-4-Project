from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    image_url = db.Column(db.String)
    bio = db.Column(db.String)

    nfts = db.relationship('Nft', backref='nft_owner')
    reviews = db.relationship('Review', back_populates='user')

    @property
    def password(self):
        raise AttributeError('Password is not readable')

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self._password_hash.encode('utf-8'))

class Project(db.Model, SerializerMixin):
    __tablename__= 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True, nullable=False)
    token_count= db.Column(db.Integer)

    project_nfts= db.relationship('Nft', backref='project')

    def get_reviews(self):
        return (Review.query.filter_by(project_id=self.id).all())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'token_count': self.token_count,
            'reviews': [review.to_dict() for review in self.get_reviews()],
        }

class Nft(db.Model, SerializerMixin):
    __tablename__= 'nfts'

    id = db.Column(db.Integer, primary_key=True)
    token_id= db.Column(db.Integer, nullable=False)

    owner= db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id= db.Column(db.Integer, db.ForeignKey('projects.id'))
    project_name= db.Column(db.String)

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    review_text = db.Column(db.String, nullable=False)

    user = db.relationship('User', back_populates='reviews')
    project = db.relationship('Project', backref='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'review_text': self.review_text,
        }

class UserProjectAssociation(db.Model):
    __tablename__ = 'user_project_association'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    web_three_alias = db.Column(db.String)

    user = db.relationship('User', backref='user_project_associations')
    project = db.relationship('Project', backref='user_project_associations')
