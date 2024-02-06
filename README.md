# Phase 4 Full-Stack Development Project

## NFT Project Community Review Application

### Introduction
-This is an application that I built in order to practice and demonstrate my full-stack development abilities.

### Usage
-Users can visit the site and view NFT projects that have been uploaded there, and the reviews of those projects.
-Users can click "Sign Up" in order to create an account, and can optionally include a bio and the URL of a profile picture in addition to the required [username and password].
-Users that have signed up can navigate to the "Login" tab in order to log in.
-Logged in users have the ability to:
  -- Submit new projects to the site
  -- Claim ownership of NFTs from existing projects
  -- View the Token ID's of NFTs they own
  -- Leave reviews on the projects that they own NFTs from
  -- View, Edit, and Delete their reviews
  -- Logout

### Client Code
  -The front-end code for this application utilizes ORM and dynamic React components. 
  -App navigation is handled by a NavBar component using React Router. 
  -Session cookies are set to prevent logout upon refresh of the app.
  -The components utilize states and effects, and operate via asynchronous fetch requests to the database. 
  -Review instances demonstrate full CRUD capabilities.
  -Conditional rendering and formatting is performed depending on whether a user is logged in or not.
  -The remainder of the formatting is done via CSS.

### Server Code
  -The back-end database features a models.py file with five tables: User, Project, NFT, UserProjectAssociation, and Review. 
  -The database utilizes flask, and secures passwords securely through encryption via bcrypt.

  -Multiple relationships have been established between the data tables, including:
  -- a One-to-Many relationship between Users and NFTs.
  -- a One-to-Many relationship between projects and NFTs.
  -- a One-to-One relationship between NFTs and their project id, project name, and owner.
  -- a One-to-Many relationship between Reviews and their users and projects.
  -- a Many-to-Many relationship between Users and Projects, established via the UserProjectAssociation table.

  The following server routes are available along with their methods expected, respectively:
   --[/signup]: expecting a POST request.
   --[/check_session]: expecting a GET request.
   --[/login]: expecting a POST request.
   --[/logout]: expecting a DELETE request.
   --[/submit_project]: expecting a POST request.
   --[/claim_ownership]: expecting a POST request.
   --[/leave_review]: expecting either a GET or POST request. 
   --[/my_reviews]: expecting a GET request.
   --[/my_reviews/<int:review_id>]: expecting a PATCH or DELETE request.

### Production & Acknowledgements
-This application was built using a template that established the basic client and server folders and some basic configurations.
-All functionalities and capabilities the application features, both on the front and the back end, were built by me from scratch.
-For troubleshooting, refactoring, and creative problem solving, I often turned to Chat GPT. Learning remotely, AI has been a tremendously helpful resource for me, and I look forward to ways it will help to advance the industry as a whole, mainly through the automation of simple tasks and allowing engineers to focus on more creative problem solving outlets.
-A special thanks goes out to Mr. Enoch Griffin. Enoch is an instructor at Flatiron school who has an impressive and in-depth understanding of all of these different concepts; his ability to assist me, identify issues I was struggling to solve, and provide other creative solutions for me throughout my work on this project was invaluable. 

