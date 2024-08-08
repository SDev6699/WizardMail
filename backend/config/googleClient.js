const { google } = require('googleapis');
const config = require('./config');

const oauth2Client = new google.auth.OAuth2(
  config.google.clientID,
  config.google.clientSecret,
  config.google.callbackURL
);

const getGmailClient = (accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

module.exports = getGmailClient;
