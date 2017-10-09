# OAUTH2 Server

Authentication and Resource Server using SQL Server Database by Fabio Guerrazzi


## Prerequisites

[Node.js](https://docs.npmjs.com/getting-started/installing-node) and [npm](https://docs.npmjs.com/getting-started/installing-node) are essential.
    
## Install npm packages

> See npm and nvm version notes above

Install the npm packages described in the `package.json` and verify that it works:

**Attention Windows Developers:  You must run all of these commands in administrator mode**.

```bash
npm install
```

If the `typings` folder doesn't show up after `npm install` please install them manually with:
```bash
npm run typings -- install`
```

Install NSP (Node Security Program)
This runs every-time you run it locally to check the security vulnerabilities of the installed packages.

```bash
npm install -g nsp
```

Install Grunt
Project builder. Compiles and minifies all files to make sure that the build is nice and small.
```bash
npm install grunt-cli -g
```

### npm scripts

We've captured many of the most useful commands in npm scripts defined in the `package.json`:

* `npm start` - runs the compiler and a server at the same time, both in "watch mode".
* `npm build` - runs grunt and generates a project build in '/build'.



### SQL Server

* Create Oauth2DB catalong in you SQL Server instance
* Open \doc\Oauth2DB.sql in your MSSQL, execute it

* `npm start` - start the server on 3001 port

watch \doc\requests.txt in order to make the correct api call in PostMan for authentication test

