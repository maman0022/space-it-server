# spACE IT!
Live Link: https://space-it.maman0022.vercel.app 
  
## Summary  
This is the server side of my full-stack spaced repetition language learning app. The main purpose of this back-end is to register and authenticate users. As well as, to retrieve user content which is hosted in a PostGreSQL database from the same host (Heroku).   
More information about this app and how it works can be found here - https://github.com/maman0022/space-it-client.  
  
## Tech Stack  
This is a Node.js back-end using the express.js server framework. Knex is used to interact with the database and postgrator is used for migrations. Helmet is used to provide header security and user passwords are hashed using bcrypt. The JSONWebToken library is used to generate the authentication tokens. Testing is done with mocha, chai, and supertest for the endpoints.

## API Documentation  
BASE URL: https://warm-eyrie-01628.herokuapp.com 
### Endpoints  

`POST /api/auth`  
Authenticates user. *Requires a request body*  
Key|Value
---|---
username|string, required
password|string, required  
  
Returns a JSON Web Token.
  
---  

`PUT /api/auth`  
Refreshes expired authentication token. *Requires a authorization header with bearer token*  
  
Returns a JSON Web Token.
  
---  
  
`POST /api/user`  
Create a new user. *Requires a request body*  
Key|Value
---|---
name|string, required
username|string, required
password|string, required  
  
---  
  
`GET /api/language`  
Gets the language and asscociated words for a user. *Requires a authorization header with bearer token*  

Returns an object containing "words" and "language" properties. 

---  
  
`GET /api/language/head`  
Gets the first word and score for a user. *Requires a authorization header with bearer token*  

Returns an object containing "nextWord", "totalScore", "wordCorrectCount", and "wordIncorrectCount" properties. 

---  
  
`POST /api/language/guess`  
Accepts a users translation for a word and returns whether it is correct and the next word. *Requires a request body & authorization header with bearer token*  
Key|Value
---|---
guess|string, required  
  
Returns an object containing "nextWord", "totalScore", "wordCorrectCount", "wordIncorrectCount", "answer", and "isCorrect" properties. 
