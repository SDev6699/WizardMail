const getGmailClient = require('../config/googleClient');
const User = require('../models/User');
const Email = require('../models/Email');

// Map to store polling intervals per user
const userPollingIntervals = new Map();

// Function to poll Gmail for a specific user
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

      if (!response.data.messages) break; // No messages found

      const messages = response.data.messages;
      pageToken = response.data.nextPageToken;

      for (const message of messages) {
        // Check if the email already exists to avoid duplicates
        const exists = await Email.findOne({ messageId: message.id, userId: user._id });
        if (exists) continue;

        const emailData = await gmail.users.messages.get({ userId: 'me', id: message.id });
        const headers = emailData.data.payload.headers;

        const email = {
          userId: user._id,
          messageId: message.id,
          threadId: emailData.data.threadId,
          sender: headers.find(header => header.name === 'From')?.value || 'Unknown sender',
          recipients: headers.find(header => header.name === 'To')?.value?.split(', ') || ['Unknown recipient'],
          subject: headers.find(header => header.name === 'Subject')?.value || 'No subject',
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

// Function to start polling for a user
const startPollingForUser = (user) => {
  if (userPollingIntervals.has(user._id.toString())) {
    // Polling already active for this user
    return;
  }

  // Immediately poll once upon login
  pollGmailForUser(user);

  // Set interval to poll every 5 minutes
  const intervalId = setInterval(() => {
    pollGmailForUser(user);
  }, 300000); // 5 minutes in milliseconds

  userPollingIntervals.set(user._id.toString(), intervalId);
};

// Function to stop polling for a user
const stopPollingForUser = (userId) => {
  const intervalId = userPollingIntervals.get(userId.toString());
  if (intervalId) {
    clearInterval(intervalId);
    userPollingIntervals.delete(userId.toString());
  }
};

module.exports = { startPollingForUser, stopPollingForUser };