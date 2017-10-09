const dotenv = require('dotenv');

// load environment variables
dotenv.load();

const express = require('express');
const passport = require('passport');
const oauth2 = require('./oauth2');
const bodyParser = require('body-parser');
const users = require('./controllers/UsersCtrl');
const http = require('http');

// security
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();

// added helmet framework
app.use(helmet());

// added hpp framework
app.use(hpp());

app.use(passport.initialize());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

require('./controllers/AuthCtrl');

// token endpoints
app.post('/oauth/token', oauth2.token);
app.get('/oauth/tokeninfo', oauth2.tokenInfo);
app.get('/oauth/userinfo', oauth2.userinfo);
app.get('/oauth/info', oauth2.info);

// user endpoints
app.put('/users/:userId', users.updateUser);
app.get('/users', users.allUsers);
app.post('/users/:userId', users.addUser);
app.get('/users/:userId', users.findUserById);
app.get('/directories/:directoryId/users', users.findUsersByDirectoryId);

// current user
app.get('/currentuser', users.findCurrentUserById);
app.put('/currentuser', users.updateCurrentUser);
app.post('/changepassword', users.changePassword);

app.post('/users/:userId/passwordresetrequest', users.addPasswordToken);
app.post('/users/:userId/passwordreset', users.passwordReset);

// admin endpoints
app.post('/admin/users/:userId', users.adminChangePassword);

// create server
http.createServer(app).listen(process.env.PORT, () => {
  console.log(`Express HTTP server listening on port ${process.env.PORT}`);
});
