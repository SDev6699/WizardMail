const getGmailClient = require('../config/googleClient');
const User = require('../models/User');
const Email = require('../models/Email');

const pollGmailForUser = async (user) => {
  try {
    const gmail = getGmailClient(user.token);
    let pageToken = null;
    const batchEmails = [];
    do {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 100,
        pageToken: pageToken
      });
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
  } catch (err) {
    console.error('Error polling Gmail for user:', err);
  }
};

const startGmailPolling = () => {
  setInterval(async () => {
    const users = await User.find({ token: { $exists: true } });
    for (const user of users) {
      await pollGmailForUser(user);
    }
  }, 300000); // Poll every 5 minutes
};

module.exports = { startGmailPolling };
