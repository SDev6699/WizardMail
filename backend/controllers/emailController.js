const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const oauth2Client = new google.auth.OAuth2(
    config.google.clientID,
    config.google.clientSecret,
    config.google.callbackURL
);

exports.getEmails = (req, res) => {
    oauth2Client.setCredentials({ access_token: req.user.token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    gmail.users.messages.list({ userId: 'me', maxResults: 10 }, (err, response) => {
        if (err) return res.status(500).send('The API returned an error: ' + err);
        const messages = response.data.messages;
        if (!messages || messages.length === 0) return res.send('No messages found.');
        
        const messagePromises = messages.map((message) => {
            return gmail.users.messages.get({ userId: 'me', id: message.id });
        });

        Promise.all(messagePromises)
            .then((messages) => res.json(messages.map((message) => message.data)))
            .catch((error) => res.status(500).send('Error fetching messages: ' + error));
    });
};

exports.deleteEmail = (req, res) => {
    const token = req.user.token;
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    gmail.users.messages.delete({ userId: 'me', id: req.params.id }, (err, response) => {
        if (err) {
            console.error('Error deleting email:', err);
            return res.status(500).send('The API returned an error: ' + err);
        }
        res.send('Email deleted successfully.');
    });
};

exports.replyEmail = (req, res) => {
    oauth2Client.setCredentials({ access_token: req.user.token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const { to, subject, text } = req.body;

    const email = [
        `To: ${to}`,
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 7bit',
        `Subject: ${subject}`,
        '',
        text,
    ].join('\n').trim();

    const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: base64EncodedEmail,
        },
    }, (err, response) => {
        if (err) return res.status(500).send('The API returned an error: ' + err);
        res.json(response.data);
    });
};
