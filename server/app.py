#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api, bcrypt
from models import User, Project, Nft, Review

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    display_projects = [project.to_dict() for project in projects]
    return {'projects': display_projects}

@app.route('/my_reviews')
def my_reviews():
    user_id = session.get('user_id')

    if user_id:
        user = User.query.get(user_id)

        if user:
            reviews = Review.query.filter_by(user_id=user.id).all()
            reviews_data = [{"id": review.id, "review_text": review.review_text} for review in reviews]

            response = jsonify({'reviews': reviews_data})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response
        else:
            return {"error": "User not found"}, 404
    else:
        return {"error": "User not logged in"}, 401

class MyReviews(Resource):
    def get(self):
        user_id = session.get('user_id')

        if user_id:
            user = User.query.get(user_id)
            
            if user:
                # Assuming you have a 'reviews' relationship in your User model
                reviews_data = [{"id": review.id, "review_text": review.review_text} for review in user.reviews]
                
                return {"reviews": reviews_data}, 200
            else:
                return {"error": "User not found"}, 404
        else:
            return {"error": "User not logged in"}, 401
                

class Signup(Resource):
    def post(self):
        json = request.get_json()
        if 'username' not in json or 'password' not in json:
            return {'error': 'Both username and password are required'}, 422

        existing_user = User.query.filter_by(username=json['username']).first()
        if existing_user:
            return {'error': 'Username already exists'}, 422

        hashed_password = bcrypt.generate_password_hash(json['password']).decode('utf-8')
        image_url = json.get('image_url', 'default_image_url')
        user = User(
            username=json.get('username'), 
            _password_hash=hashed_password,
            image_url=image_url,
            bio=json.get('bio')
        )
        db.session.add(user)
        db.session.commit()
        session['user_id']=user.id
        return {
            'username': user.username,
            'id': user.id,
            'image_url': user.image_url,
            'bio': user.bio
            }, 201

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')

        if user_id:
            user = User.query.filter_by(id=user_id).first()
            return {
                'username': user.username,
                'id': user.id,
                'image_url': user.image_url,
                'bio': user.bio
            }, 200
        else:
            return {"Error": "No user is currently signed in."}, 401

class Login(Resource):
    def post(self):
        json = request.get_json()
        username = json.get('username')
        password = json.get('password')

        if not username or not password or not username.strip() or not password.strip():
            return {'error': 'Both username and password are required'}, 400

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id
            return {
                'username': user.username,
                'id': user.id,
                'image_url': user.image_url,
                'bio': user.bio
            }, 200
        else:
            return {'error': 'Invalid username or password'}, 401


class Logout(Resource):
    def delete(self):
        user_id= session.get('user_id')
        if user_id is not None: 
            session['user_id']= None
            return {}, 204
        else:
            return {'error': 'No user is currently logged in.'}, 401

class SubmitProject(Resource):
    def post(self):
        json = request.get_json()
        user_id = session.get('user_id')

        if user_id is not None:
            existing_project = Project.query.filter_by(name=json.get('name')).first()

            if existing_project:
                return {"error": "A project with the same name already exists"}, 400
            token_count = json.get('token_count')
            if int(token_count) <= 0:
                return {"error": "Token count must be greater than 0"}, 400

            project = Project(
                name=json.get('name'),
                token_count=token_count
            )
            db.session.add(project)
            db.session.commit()

            return {"message": "Project submitted successfully."}, 201
        else:
            return {"error": "User not logged in"}, 401

class ClaimOwnership(Resource):
    def post(self):
        json = request.get_json()
        user_id = session.get('user_id')

        if user_id is not None:
            token_id = json.get('token_id')
            project_id = json.get('project_id')

            project = Project.query.get(project_id)
            if not project:
                return {"error": "Invalid project ID"}, 404

            nft = Nft.query.filter_by(token_id=token_id, project_id=project_id).first()

            if not nft:
                nft = Nft(
                    token_id=token_id,
                    project_id=project_id,
                    owner= session.get('user_id')
                )

            nft.owner_id = user_id
            db.session.add(nft)
            db.session.commit()

            return {"message": "Ownership claimed successfully"}, 200
        else:
            return {"error": "User not logged in"}, 401

class LeaveReview(Resource):
    def post(self):
        json = request.get_json()
        user_id = session.get('user_id')

        if user_id is not None:
            project_id = json.get('project_id')
            review_text = json.get('review_text')

            is_owner = db.session.query(User).join(User.nfts).join(Nft.project).filter(Project.id == project_id, User.id == user_id).first()

            if not is_owner:
                return {"error": "You are not the owner of this project. Only owners can leave reviews."}, 403

            review = Review(
                user_id=user_id,
                project_id=project_id,
                review_text=review_text
            )

            db.session.add(review)
            db.session.commit()

            return {"message": "Review submitted successfully"}, 201
        else:
            return {"error": "User not logged in"}, 401

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(SubmitProject, '/submit_project', endpoint='submit_project')
api.add_resource(ClaimOwnership, '/claim_ownership', endpoint='claim_ownership')
api.add_resource(LeaveReview, '/leave_review', endpoint='leave_review')
# api.add_resource(MyReviews, '/my_reviews', endpoint='my_reviews')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

