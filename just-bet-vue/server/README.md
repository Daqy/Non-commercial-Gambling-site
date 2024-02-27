# Just bet server

this serve handles all the request and login details for the website just bet.

## setup

first step is to run: `npm install`\
then setup the environment, the following items are used

- **PORT (OPTIONAL):** the port the server should run on
- **DB_NAME:** the database name to use
- **DB_URI:** the url to the database being used, in my case it is mongodb
- **TOKEN_KEY:** key used to encrypt the JWT token

`npm run dev`: runs nodemon so for development\
`npm run start`: starts the server normally.
