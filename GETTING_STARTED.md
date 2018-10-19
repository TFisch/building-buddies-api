## Getting Started

This is a general guide to setting up the Building Buddies API on your local machine.

### Dependencies 🔐

* Node.js ^10.0.0
* PostgreSQL database
* NPM packages (see package.json file)
* [Nodemon](https://nodemon.io/) installed globally

If you are likely to need to manage multiple version of Node.js on your local machine, we recommend [NVM](https://github.com/creationix/nvm).


### Get it  📌

If you're planning on contributing code to the project it is a good idea to begin by forking this repo using the `Fork` button in the top-right corner of this screen. You should then be able to use `git clone` to copy your fork onto your local machine.

    git clone https://github.com/laurakwhit/building-buddies-api

Go into your new local copy of the Builidng Buddies API:

    cd building-buddies-api

And then add an `upstream` remote that points to the main repo:

    git remote add -u https://github.com/laurakwhit/building-buddies-api

Run the following command:

    npm install

### Get it running 🏃

First, you need to create the developent and tests databasesthe app will use by manually typing the following in your terminal:

```sh
$ psql 
$ CREATE DATABASE buildingbuddies;
$ CREATE DATABASE buildingbuddies_test;
```

In a separate terminal window from your database setup, run the migrations and seed for each database:

```sh
$ knex migrate:latest
$ knex seed:run
$ NODE_ENV=test knex migrate:latest
$ NODE_ENV=test knex seed:run
```

To start the server in development mode run: 
```sh
$ npm run dev
```

Your server should now be running on http://localhost:5000 😀

### Testing 📝

To run the test suite enter:

    $ npm test
    
