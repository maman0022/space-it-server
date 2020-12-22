# Spaced repetition API!
Live Link: https://spaced-repetition.maman0022.vercel.app  
  
## Summary  
This is the server side of my full-stack spaced repetition language learning app. The main purpose of this back-end is to register and authenticate users. As well as, to retrieve user content which is hosted in a PostGreSQL database from the same host (Heroku).   
More information about this app and how it works can be found here - https://github.com/maman0022/spaced-repetition-client.  
  
## Tech Stack  
This is a Node.js back-end using the express.js server framework. Knex is used to interact with the database and postgrator is used for migrations. Helmet is used to provide header security and user passwords are hashed using bcrypt. The JSONWebToken library is used to generate the authentication tokens. Testing is done with mocha, chai, and supertest for the endpoints.

## API Documentation  
BASE URL: https://warm-eyrie-01628.herokuapp.com
All of the endpoints except login and register require an authorization header with bearer type and token provided on login.  
### Endpoints  

`POST /api/login`  
Authenticates user. *Requires a request body*  
Key|Value
---|---
email|string, required
password|string, required  
  
Returns a JSON Web Token.
  
---  
  
`POST /api/register`  
Create a new user. *Requires a request body*  
Key|Value
---|---
fname|string, required
lname|string, required
email|string, required
password|string, required  
  
---  
  
`GET /api/courses`  
Gets all courses for a user.  
Returns an array of course objects which contain an id, title, date created, display color, and user id.  

---  
  
`POST /api/courses`  
Create a new course and add it to user's profile. *Requires a request body*  
Key|Value
---|---
title|string, required  
  
Returns a course object which contains an id, title, date created, display color, and user id.

---  
  
`GET /api/courses/[id]`  
Gets a course for a user with associated notes and essays.  
Returns an object containing course, notes, and essays properties.  
Course is same as described above, notes and essays is an array of objects containing id, title, date created, user id, course id, and content.
  
---  
  
`DELETE /api/courses/[id]`  
Deletes a course.  
Returns a 204 if succesful.
  
---  
  
`PATCH /api/courses/[id]`  
Updates the color associated with that course. *Requires a request body*  
Key|Value
---|---
color|string, required  
  
Returns a 204 if succesful.
  
---  
  
`POST /api/(notes | essays)`  
Create a new note or essay depending on which endpoint is used and adds it to user's course. *Requires a request body*  
Key|Value
---|---
title|string, required  
content|string, required  
courseId|integer, required
  
Returns an object containing an id, title, date created, user id, course id, and content.

---  
  
`GET /api/(notes | essays)/[id]`  
Gets a specific note or essay based on id    
Returns an object containing an id, title, date created, user id, course id, and content.

---  
  
`DELETE /api/(notes | essays)/[id]`  
Deletes a note or essay.  
Returns a 204 if succesful.
  
---  
  
`PATCH /api/(notes | essays)/[id]`  
Updates the title and/or content associated with that note or essay. *Requires a request body*  
Key|Value
---|---
title|string, required  
content|string, required  
  
Returns an object containing the updated properties.  
