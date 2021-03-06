let oauth2orize = require('oauth2orize'),
  passport = require('passport'),
  models = require('./models'),
  utils = require('./helpers/common/utils'),
  crypto = require('crypto'),
  async = require('async'),
  _ = require('lodash'),
  modelsSequelize = require('./models'),
  config = require('./config'),
  tokenCtrl = require('./controllers/TokenCtrl');

// create OAuth 2.0 server
const server = oauth2orize.createServer();

/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
  const userScope = (scope) ? scope[0] : '';
  let token = {};
  let refreshToken = {};

  async.series({
    checkuserLock(callback) {
      modelsSequelize.sequelize.query('SELECT * FROM [UserLogins]' +
				' WHERE [userId] = $userId' +
				' AND [LoginDate] > DATEADD(MINUTE, -$minutes, GETDATE())' +
				' AND [LoginResult] = $loginResult AND [ignore] = $ignore', {
  type: modelsSequelize.sequelize.QueryTypes.SELECT,
  bind: {
    userId: username,
    loginResult: 'failure',
    minutes: 30,
    ignore: 'No',
    updateAt: new Date()
  }
}).then((response) => {
  console.log(response);
  if (_.size(response) >= 3) {
					// user should get locked
    modelsSequelize.Users.update({
      locked: 'Yes'
    }, {
      where: {
        userId: username
      }
    });


					// remove all tokens
    modelsSequelize.AccessTokens.destroy({
      where: {
        userId: username
      }
    });

    modelsSequelize.RefreshTokens.destroy({
      where: {
        userId: username
      }
    });

    return callback(true); // error
  }
					// unlock user
  modelsSequelize.Users.update({
    locked: 'No'
  }, {
    where: {
      userId: username
    }
  });
  return callback();
});
    },
    user(callback) {
      modelsSequelize.Users.findOne({
        where: {
          userId: username
        }
      }).then((user) => {
				// check if user is valid
        if (_.isEmpty(user)) {
          return callback(true); // error
        }
        const passwordHash = crypto.createHmac('sha256', password)
					.update(config.SALT_KEY)
					.digest('hex');

				// check if client secret provided matches the server code
        if (user.dataValues.password !== passwordHash) {
          return callback(true); // error
        }

				// check if client secret provided matches the server code
        if (user.dataValues.enabled !== 'Yes') {
          return callback(true); // error
        }

				// check if user is locked
        if (user.dataValues.locked === 'Yes') {
          return callback(true); // error
        }

        callback();
      });
    },
    removeAllTokens(callback) {
      modelsSequelize.AccessTokens.destroy({
        where: {
          applicationId: client.applicationId,
          userId: username
        }
      });
      modelsSequelize.RefreshTokens.destroy({
        where: {
          applicationId: client.applicationId,
          userId: username
        }
      });
      callback();
    },
    accessToken(callback) {
      token = utils.uid(config.token.accessTokenLength);

      modelsSequelize.AccessTokens.create({
        tokenId: token,
        userId: username,
        applicationId: client.applicationId,
        expires: config.token.calculateExpirationDate(),
        scope: userScope
      }).then(() => {
        callback();
      }).catch(err => callback(err));
    },
    refreshToken(callback) {
      console.log(callback); // fabio
      refreshToken = utils.uid(config.token.refreshTokenLength);

      modelsSequelize.RefreshTokens.create({
        tokenId: refreshToken,
        userId: username,
        applicationId: client.applicationId,
        expires: config.token.calculateRefreshExpirationDate(),
        scope: userScope
      }).then(() => {
        callback();
      }).catch(err => callback(err));
    }
  }, (err) => {
    if (err) {
      console.log(err);
   /*    modelsSequelize.UserLogins.create({
        userId: username,
        loginResult: 'failure',
        ignore: 'No',
        loginDate: new Date()
      }); */
      return done(null);
    }

		// success
    modelsSequelize.UserLogins.create({
      userId: username,
      loginResult: 'success',
      ignore: 'No',
      loginDate: new Date()
    });
    return done(null, token, refreshToken, {
      expires_in: config.token.expiresIn
    });
  });
}));

/**
 * Exchange the refresh token for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id from the token
 * request for verification.  If this value is validated, the application issues an access
 * token on behalf of the client who authorized the code
 */
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  let newToken = '';
  let newRefreshToken = '';
  let methodResponse = {};

  async.series({
		// validate refresh token
    validateRefreshToken(callback) {
      tokenCtrl.validateRefreshToken({
        applicationId: client.applicationId,
        token: refreshToken
      },
				(err, data) => {
  if (err) {
    return callback(err);
  }

  methodResponse = data;
  return callback();
}
			);
    },
		// delete user's tokens
    removeAllTokens(callback) {
			// remove all token and refresh token
      tokenCtrl.removeAllTokens({
        applicationId: client.applicationId,
        username: methodResponse.userId
      },
				callback
			);
    },
    accessToken(callback) {
			// save new token
      tokenCtrl.saveNewAccessToken({
        applicationId: client.applicationId,
        username: methodResponse.userId,
        scope: methodResponse.scope
      },
				// callback method
				(err, data) => {
					// return error
  if (err) {
    return callback(err);
  }

					// save data
  newToken = data;
  return callback();
}
			);
    },
    refreshToken(callback) {
			// save new refresh token
      tokenCtrl.saveNewRefreshToken({
        applicationId: client.applicationId,
        username: methodResponse.userId,
        scope: methodResponse.scope
      },
				// callback method
				(err, data) => {
					// return error
  if (err) {
    return callback(err);
  }

					// save data
  newRefreshToken = data;
  return callback();
}
			);
    }
  }, (err) => {
    if (err) {
      console.log(err);
      return done(null);
    }
    return done(null, newToken, newRefreshToken, {
      expires_in: config.token.expiresIn
    });
  });
}));

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {
    session: false
  }),
  server.token(),
  server.errorHandler()
];

exports.tokenInfo = [
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
    const response = req.user.user;
    response.scope = (_.isEmpty(req.authInfo)) ? '' : req.authInfo;
    res.json(response);
  }
];

exports.info = [
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
    models.AccessTokens.findOne({
      where: {
        tokenId: req.user.accessToken.tokenId
      }
    }).then((token) => {
      const expirationLeft = Math.floor((token.expires.getTime() - Date.now()) / 1000);
      res.json({
        audience: token.applicationId,
        userId: token.userId,
        scope: token.scope,
        expiresIn: expirationLeft
      });
    }).catch((err) => {
      res.status(err.status);
      res.json({
        error: err.message
      });
    });
  }
];

exports.userinfo = [
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res) {
    const response = req.user.user;
    response.scope = (_.isEmpty(req.authInfo)) ? '' : req.authInfo;
    res.json(response);
  }
];
