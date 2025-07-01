# Setting up database 
- Download the installer: https://www.postgresql.org/download/windows/

Run the installer, pick a password for the postgres user.

Use pgAdmin or the terminal to manage.

## Setting up the db
- add the postgres bin folder to path 
- open cmd and type 
psql -U postgres
- run the following command to create our db 
createdb -U postgres growtion_db
- run the caommand to add our db user
CREATE USER growtion_user WITH ENCRYPTED PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE growtion_db TO growtion_user;
- you also may need to grant permissions to this user to change the schema of the db 
psql -U postgres -d growtion_db
GRANT USAGE ON SCHEMA public TO growtion_user;
GRANT CREATE ON SCHEMA public TO growtion_user;
-if you want to grant all access
GRANT ALL PRIVILEGES ON DATABASE growtion_db TO growtion_user;
