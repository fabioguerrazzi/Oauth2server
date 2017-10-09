const helper = require('sendgrid').mail;
const config = require('../../config');

const sendMail = function (mailToSend, next) {
  const externalRequest = require('request');
  const body =
    {
      personalizations: [
        {
          to: [
            {
              email: mailToSend.to
            }
          ],
          subject: mailToSend.subject
        }
      ],
      from: {
        email: mailToSend.from
      },
      content: [
        {
          type: mailToSend.type,
          value: mailToSend.content
        }
      ]
    };
  const options = {
    method: 'POST',
    url: `${config.MAIL_CONFIG.URL}/v3/mail/send`,
    headers: {
      Authorization: `Bearer ${config.SENDGRID_CONFIG.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body,
    json: true
  };
  externalRequest(options, (err) => {
    if (err) {
      return next(err);
    }
    return next();
  });

/*
	// shape request
	var emailFrom = new helper.Email(mailToSend.from);
	var emailTo = new helper.Email(mailToSend.to);
	var emailContent = new helper.Content(mailToSend.type, mailToSend.content);
	var mail = new helper.Mail(emailFrom, mailToSend.subject, emailTo, emailContent);

	// configure email sender
	var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

	// send email
	sg.API(request)
		.then(function () {
			return next();
		}).catch(function (err) {
		return next(err);
	}); */
};

module.exports =
{
  sendMail
};
