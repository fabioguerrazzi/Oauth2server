const models = require('../models');
const _ = require('lodash');
const passport = require('passport');
const crypto = require('crypto');
const async = require('async');
const utils = require('../helpers/common/utils');
const config = require('../config');
const emails = require('../controllers/EmailCtrl');
const moment = require('moment');
const xss = require('xss');

const encryptPassword = password =>
  crypto.createHmac('sha256', password).update(config.SALT_KEY).digest('hex');

const userReq = (userId, firstname, lastName, email, gender, dateOfBirth, allowContact) => ({
  userId: xss(userId),
  firstName: xss(firstname) || '',
  lastName: xss(lastName) || '',
  email: xss(email) || '',
  gender: xss(gender) || 'unknown',
  dateOfBirth: xss(dateOfBirth) || null,
  allowContact: xss(allowContact) || 'No',
  created: new Date(),
  createdBy: userId,
  lastUpdate: new Date(),
  lastUpdateBy: userId,
  lastChangedPassword: new Date(),
  type: 'USER',
  enabled: 'Yes',
  locked: 'No'
});

const setUserAsStudent = (user, isStudent, yearOfStudy) => {
  user.isStudent = xss(isStudent) || 'No';
  user.yearOfStudy = xss(yearOfStudy) || '';
};

const setUserAsEmployee = (user, isEmployee) => {
  user.isEmployee = xss(isEmployee) || 'No';
};

const setUserDirectoryId = (user, directoryId) => {
  user.directoryId = xss(directoryId) || '';
};

const setUserApplicationId = (user, applicationId) => {
  user.applicationId = xss(applicationId) || '';
};

const setUserPassword = (user, password) => {
  user.password = encryptPassword(xss(password)) || '';
};

const userDirectoryReq = (userId, directoryId) => ({
  userId: xss(userId),
  directoryId: xss(directoryId)
});

const userApplicationReq = (userId, applicationId) => ({
  userId: xss(userId),
  applicationId: xss(applicationId)
});

const tokenReq = (type, userId, applicationId, expires, scope) => {
  const token = {
    userId: xss(userId),
    applicationId: xss(applicationId),
    expires: config.token.calculateExpirationDate(),
    scope: xss(scope)
  };

  let tokenId = null;
  if (type === 'ACCESS_TOKEN') {
    tokenId = utils.uid(config.token.accessTokenLength);
  } else if (type === 'REFRESH_TOKEN') {
    tokenId = utils.uid(config.token.refreshTokenLength);
  }

  return Object.assign({}, token, { tokenId });
};


const addUser = function (req, res) {
  const userId = xss(req.params.userId, config.xssConfig);

// create new user
  const user = userReq(
      userId,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.gender,
      req.body.dateOfBirth,
      req.body.allowContact
    );

  setUserPassword(user, req.body.password);
  setUserApplicationId(user, req.body.applicationId);
  setUserDirectoryId(user, req.body.directoryId);

  // if user is a student, set student attributes
  const isStudent = req.body.isStudent;
  const yearOfStudy = req.body.yearOfStudy;
  if (isStudent) {
    setUserAsStudent(user, isStudent, yearOfStudy);
  }

  // if user is an employee, set employee attributes
  const isEmployee = req.body.isEmployee;
  if (isEmployee) {
    setUserAsEmployee(user, isEmployee);
  }

  // create user directory
  const userDirectory = userDirectoryReq(user.userId, user.directoryId);
  // create user application
  const userApplication = userApplicationReq(user.userId, user.applicationId);
  // create access token
  const accessToken = tokenReq(
      'ACCESS_TOKEN',
      user.userId,
      user.applicationId,
      user.scope
    );
  // create refresh token
  const refreshToken = tokenReq(
      'REFRESH_TOKEN',
      user.userId,
      user.applicationId,
      user.scope
    );

  models.Users.findOne({
    where:
      { userId }
  }).then((userFound) => {
      // if user already exists go back with predefined message avoiding user enumeration
    if (userFound) {
      res.status(500);
      res.json({ code: 'CREDENTIALS_NOT_VALID', message: 'Credentials submitted are not valid.' });
    } else {
      return models.sequelize.transaction(t => Promise.all([
        models.Users.create(user, { transaction: t }),
        models.UserDirectories.create(userDirectory, { transaction: t }),
        models.UserApplications.create(userApplication, { transaction: t }),
        models.AccessTokens.create(accessToken, { transaction: t }),
        models.RefreshTokens.create(refreshToken, { transaction: t })
      ]));
    }
  }).then(() => {
    res.status(200);
    res.json({
      access_token: accessToken.tokenId,
      refresh_token: refreshToken.tokenId,
      expires_in: config.token.expiresIn,
      token_type: 'Bearer'
    });
  }).catch((err) => {
    res.status(500);
    res.json({ code: err.code || err.name, message: err.message });
  });
};

const findUsersByDirectoryId = function (req, res) {
  models.UserDirectories.findAll({
    where: {
      directoryId: req.params.directoryId
    },
    include: [
            { model: models.Users }
    ]
  }).then((users) => {
    res.json(_.map(users, 'User'));
  }).catch((err) => {
    res.json(err);
  });
};

const findUserById = (req, res, next) => {
  const userId = req.params.userId;
  models.Users.findOne({
    where: {
      userId
    }
  }).then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(utils.formatJSONResponse(user));
  }).catch(err => next(err));
};

const findCurrentUserById = (req, res, next) => {
  const currentUserId = req.user.user.userId;
  models.Users.findOne({
    where: {
      userId: currentUserId
    }
  }).then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(utils.formatJSONResponse(user));
  }).catch(err => next(err));
};

const allUsers = (req, res, next) => {
  models.Users.findAll({
  }).then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(utils.formatJSONResponse(users));
  }).catch(err => next(err));
};

const addPasswordToken = function (req, res) {
  const userObject = {
    userId: xss(req.params.userId, config.xssConfig),
    email: ''
  };

  async.series({
    user(callback) {
      models.Users.findOne({
        where: {
          userId: userObject.userId
        }
      }).then((user) => {
        if (!_.isEmpty(user)) {
          if (user.dataValues.email == '') {
            callback({ code: 'CREDENTIALS_NOT_VALID', message: 'Credentials submitted are not valid.' });
          }

          userObject.email = user.dataValues.email;
          return callback();
        }
        return callback({ code: 'CREDENTIALS_NOT_VALID', message: 'Credentials submitted are not valid.' });
      }).catch(err => callback(err));
    },
    add(callback) {
            // delete any existing tokens
      models.UserPasswordTokens.destroy({
        where: {
          userId: userObject.userId
        }
      }).then(() => {
        userObject.token = utils.uid(config.token.passwordTokenLength);
        userObject.expiry = config.token.calculateExpirationDate();

        models.UserPasswordTokens.create(userObject)
                    .then(() => callback()).catch(err => callback(err));
      }).catch(err => callback(err));
    },
    email(callback) {
      let content = '<html><head><title>Password Reset</title></head>' +
                '<body><p>Hello,</p>' +
                '<p>You recently requested your password be reset.</p>' +
                '<p>1. Click the link below to open a new and secure browser window.</p>' +
                '<p>2. Enter the requested information and follow the instructions to reset your password.</p>' +
                '<p>To reset your password use the following link:</p>' +
                '<p><a href=\"https://sharethelove.co.uk/passwordrecoverycomplete.aspx?fldToken=[fldToken]\">Continue to Reset Password</a></p>' +
				'<p><b>Please note that the link is valid for one hour from the time you submitted your request. After one hour the link will become inactive and you will need to submit your request again.</b></p>' +
                '<p>Regards</p>' +
                '</body>' +
                '</html>';

      content = content.replace('[fldToken]', userObject.token);

      return emails.sendEmail(
        {
          to: userObject.email,
          from: config.MAIL_CONFIG.FROM,
          subject: 'Reset your password',
          content,
          contentType: 'text/html'
        }, callback);
    }
  }, (err) => {
    if (err) {
      res.status(500);
      res.json({ code: err.code, message: err.message });
    } else {
      res.json();
    }
  });
};

const passwordReset = function (req, res) {
  const userObject = {
    userId: xss(req.params.userId, config.xssConfig),
    token: xss(req.body.token, config.xssConfig),
    password: xss(req.body.password, config.xssConfig)
  };

  async.series({
    user(callback) {
            // find user
      models.Users.findOne({
        where: {
          userId: userObject.userId
        }
      }).then((userResponse) => {
        if (!_.isEmpty(userResponse)) {
          return callback();
        }
        res.status(404);
        return callback({ code: 'CREDENTIALS_NOT_VALID', message: 'Credentials submitted are not valid.' });
      }).catch(err => callback(err));
    },
    expired(callback) {
      models.sequelize.query('SELECT [userId],[token],[expiry] FROM [UserPasswordTokens]' +
                ' WHERE [userId] = $userId AND [token] = $token AND $currentDate <= [expiry]',
        {
          type: models.sequelize.QueryTypes.SELECT,
          bind: {
            userId: userObject.userId,
            token: userObject.token,
            currentDate: moment(new Date()).format('YYYY-MM-DD HH:MM:ss')
          }
        }).then((userPwdResponse) => {
          if (!_.isEmpty(userPwdResponse)) {
            return callback();
          }
          res.status(404);
          return callback({ code: 'CREDENTIALS_NOT_VALID', message: 'Credentials submitted are not valid.' });
        }).catch(err => callback(err));
    },
    userPassword(callback) {
      models.sequelize.query('UPDATE [Users] SET [password] = $password,[lastChangedPassword] = GETDATE(),' +
                '[lastUpdate] = GETDATE(),[lastUpdateBy] = $userId WHERE [userId] = $userId',
        {
          type: models.sequelize.QueryTypes.UPDATE,
          bind: {
            userId: userObject.userId,
            password: crypto.createHmac('sha256', req.body.password).update(config.SALT_KEY).digest('hex'),
          }
        }).then(() => {
          models.UserPasswordTokens.update({
            token: '',
            expiry: new Date()
          }, {
            where: {
              userId: userObject.userId
            }
          }).then(() => callback()).catch(err => callback(err));
        }).catch(err => callback(err));
    }
  }, (err) => {
    if (err) {
      if (_.isNull(res.statusCode) || res.statusCode == 200) {
        res.status(400);
      }
      res.json({ code: err.code, message: err.message });
    } else {
      res.status(200);
      res.json();
    }
  });
};

const addUserLogin = function (req, res) {
  return models.users.logins.add({ userId: req.userId })
        .then(() => {

        }).fail((err) => {
          res.status(400);
          res.json({ code: err.code, message: err.message });
        });
};

const createUserFromRequest = req => ({
  firstName: xss(req.body.firstName, config.xssConfig),
  lastName: xss(req.body.lastName, config.xssConfig),
  email: xss(req.body.email, config.xssConfig),
  mobile: xss(req.body.mobile, config.xssConfig),
  postCode: xss(req.body.postCode, config.xssConfig),
  title: xss(req.body.title, config.xssConfig),
  knownAs: xss(req.body.knownAs, config.xssConfig),
  dateOfBirth: xss(req.body.dateOfBirth, config.xssConfig),
  gender: xss(req.body.gender, config.xssConfig),
  telephone: xss(req.body.telephone, config.xssConfig),
  houseNumber: xss(req.body.houseNumber, config.xssConfig),
  address1: xss(req.body.address1, config.xssConfig),
  address2: xss(req.body.address2, config.xssConfig),
  town: xss(req.body.town, config.xssConfig),
  country: xss(req.body.country, config.xssConfig),
  allowContact: xss(req.body.allowContact, config.xssConfig),
  locationId: xss(req.body.locationId, config.xssConfig),
  yearOfStudy: xss(req.body.yearOfStudy, config.xssConfig),
  isEmployee: xss(req.body.isEmployee, config.xssConfig),
  isStudent: xss(req.body.isStudent, config.xssConfig)
});

const updateCurrentUser = (req, res, next) => {
  const userReq = createUserFromRequest(req);
  models.Users.update(userReq, {
    where: {
      userId: req.user.user.userId
    }
  }).then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(utils.formatJSONResponse(user));
  }).catch(err => next(err));
};

const updateUser = function (req, res, next) {
  const userReq = createUserFromRequest(req);
  const userId = req.user.user.userId;
  models.Users.update(userReq, {
    where: {
      userId
    }
  }).then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(utils.formatJSONResponse(user));
  }).catch(err => next(err));
};

const changePassword = function (req, res, next) {
  const userId = req.user.user.userId;
  const password = xss(req.body.password);
  const encryptedPassword = encryptPassword(password);
  models.Users.update({ password: encryptedPassword },
    { where: {
      userId
    } })
    .then(() => res.end())
    .catch(err => next(err));
};

const adminChangePassword = (req, res, next) => {
  const password = xss(req.body.password);
  models.Users.update({
    password: crypto
            .createHmac('sha256', password)
            .update(process.env.SALT_KEY)
            .digest('hex')
  },
    {
      where: {
        userId: xss(req.params.userId)
      }
    }).then(() => {
      res.end();
    }).catch(err => next(err));
};

module.exports = {
  addUser,

  addUserLogin,

  allUsers: [
    passport.authenticate('bearer', { session: false }),
    allUsers
  ],

  findUserById: [
    passport.authenticate('bearer', { session: false }),
    findUserById
  ],

  findCurrentUserById: [
    passport.authenticate('bearer', { session: false }),
    findCurrentUserById
  ],

  updateUser: [
    passport.authenticate('bearer', { session: false }),
    updateUser
  ],

  updateCurrentUser: [
    passport.authenticate('bearer', { session: false }),
    updateCurrentUser
  ],

  findUsersByDirectoryId: [
    passport.authenticate('bearer', { session: false }),
    findUsersByDirectoryId],

  addPasswordToken: [
    addPasswordToken],

  passwordReset: [
    passwordReset],

  changePassword: [
    passport.authenticate('bearer', { session: false }),
    changePassword],

  adminChangePassword: [
    passport.authenticate('bearer', { session: false }),
    adminChangePassword]
};
