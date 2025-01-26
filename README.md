#My Project

## Setup
1. 
Make sure you have Go installed

2. Navigate to the backend directory and run 'go mod download' to install dependencies and then run 'go mod vendor'

2. 
Run 'go install github.com/pressly/goose/v3/cmd/goose@latest' for migrations

3.
Set up a .env file in the backend directory with the information below: 
PORT = {your server port number}
DB_URL= postgres://{username}:{password}@localhost:{port number}/{dbname}?sslmode=disable 

4. 
To start the backend, go to the backend/sql/schema directory and run 'goose postgres postgres://{username}:{password}@localhost:{server port number}/{dbname} up' to run all the migrations

5.
Then navigate back to the backend directory and run 'go build'.

6.
A new file should appear in your backend folder and now run './{name of new file}'. This should start your backend server.

7.
Navigate to the frontend directory and set up a .env file with the information below:
    VITE_BASE_URL= http://localhost:{server port number}

8. 
To start the frontend, go to frontend directory and run 'npm install' in the terminal. Then run 'npm start'

9. 
To start using the forum, you can start by creating the 'admin' user. This admin account would have authority to create new pages for everyone (e.g. Chapter 5: Orthogonality etc.)

10.
Once pages are created, users can create posts, comment on posts etc.
