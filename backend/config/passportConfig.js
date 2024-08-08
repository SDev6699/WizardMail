const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');
const User = require('../models/User');
const Email = require('../models/Email');
const getGmailClient = require('../config/googleClient');
const { startPollingForUser } = require('../polling/gmailPolling');

passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL,
  scope: config.google.scopes
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      user.token = accessToken;
      await user.save();
    } else {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        token: accessToken
      });
      await user.save();
    }

    done(null, user);

    // Fetch and store emails in batches in the background
    const gmail = getGmailClient(accessToken);
    let pageToken = null;
    const batchEmails = [];
    do {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 100,
        pageToken: pageToken
      });

      if (!response.data.messages) break; // Handle case when there are no messages

      const messages = response.data.messages;
      pageToken = response.data.nextPageToken;

      for (const message of messages) {
        const emailData = await gmail.users.messages.get({ userId: 'me', id: message.id });
        const email = {
          userId: user._id,
          sender: emailData.data.payload.headers.find(header => header.name === 'From').value || 'Unknown sender',
          recipients: emailData.data.payload.headers.find(header => header.name === 'To').value.split(', ') || ['Unknown recipient'],
          subject: emailData.data.payload.headers.find(header => header.name === 'Subject').value || 'No subject',
          body: emailData.data.snippet || 'No content',
          date: new Date(parseInt(emailData.data.internalDate)),
          folder: 'inbox'
        };
        batchEmails.push(email);
      }

      if (batchEmails.length >= 100) {
        await Email.insertMany(batchEmails);
        batchEmails.length = 0; // Clear the batch array
      }
    } while (pageToken);

    if (batchEmails.length > 0) {
      await Email.insertMany(batchEmails); // Insert remaining emails
    }

    startPollingForUser(user);

  } catch (err) {
    console.error('Error in Google OAuth strategy:', err);
    done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
