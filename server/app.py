#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api, bcrypt
from models import User, Project, Nft

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/projects')
def index_2():
    projects= Project.query.all()
    display_projects=[]
    for project in projects:
        display_projects.append(project.to_dict())
    return '<h1>Hello</h1>'

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
        if 'username' not in json or 'password' not in json:
            return {'error': 'Both username and password are required'}, 400

        user = User.query.filter_by(username=json['username']).first()

        if user and user.authenticate(json['password']):

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
        user_id= session.get('user_id')
        if user_id is not None:
            project= Project(
                name= json.get('name'),
                token_count=json.get('token_count')
            )
            db.session.add(project)
            db.session.commit()
            return {"message": "Project submitted successfully."}, 201

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

            # if nft.owner_id is not None:
            #     return {"error": "NFT is already claimed"}, 400

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

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(SubmitProject, '/submit_project', endpoint='submit_project')
api.add_resource(ClaimOwnership, '/claim_ownership', endpoint='claim_ownership')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

