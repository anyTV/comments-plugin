Comments-Plugin
=====

Comments plugin for GamersTM

Running the Application
---------------------
#### Project Setup
- Download Project

```sh
    git clone https://github.com/anyTV/comments-plugin.git
```

OR

```sh
    git clone git@github.com:anyTV/comments-plugin.git
```

#### Database Setup
- Import database/sql/anytv_comments.sql to anytv_comments schema

```sh
    mysql -uroot --database=anytv_comments < database/sql/anytv_comments.sql
```

- Also remember to add REDIS to your system. In unix :

```
    sudo apt-get install redis
```

#### Point gamers.tm -> 127.0.0.1

Add this entry in you hosts file
```
    127.0.0.1     dev.gamers.tm
```

*nix: /etc/hosts
windows: \WINDOWS\system32\drivers\etc

#### Install packages

- Run these commands :

```sh
    npm i -g forever
    npm i -g nodemon
    npm i -g npm-check-updates
    npm install -g bower
    npm-check-updates -u
    bower install
    npm install
```

#### Update Files

- Check package.json for changes (may change depending on npm-check-updates -u)
- Update config/config.js (change for your own environment)


#### Run the app

```sh
    sudo nodemon server
```

- check http://dev.gamers.tm:9090

you should see
```js
{message: "Nothing to do here."}
```

Coding conventions
---------------------

  Read JS-Conventions [Here](https://github.com/anyTV/JS-conventions)

Configuration
---------------------

create config/env/development.js. copy contents from config/env/sample.js
ask fellow devs for the following keys

- SESSION_SECRET
- API_KEY
- client_id
- client_secret

or simply copy their development.js
