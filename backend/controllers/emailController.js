const Email = require('../models/Email');
const fs = require('fs');

exports.getEmails = async (req, res) => {
  try {
    const { folder, page = 1, limit = 10 } = req.query;
    const emails = await Email.find({ userId: req.user._id, folder: folder || 'inbox' })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(emails);
  } catch (error) {
    res.status(500).send('Error fetching emails: ' + error);
  }
};

exports.getThreads = async (req, res) => {
  try {
    const { folder, page = 1, limit = 10 } = req.query;
    const emails = await Email.aggregate([
      { $match: { userId: req.user._id, folder: folder || 'inbox' } },
      { $group: { _id: "$threadId", latestEmail: { $last: "$$ROOT" } } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);
    res.json(emails.map(group => group.latestEmail));
  } catch (error) {
    res.status(500).send('Error fetching email threads: ' + error);
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const attachments = req.files.map(file => file.path);
    const email = new Email({ ...req.body, attachments, userId: req.user._id });
    await email.save();
    res.status(201).json(email);
  } catch (error) {
    res.status(500).send('Error sending email: ' + error);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error marking email as read: ' + error);
  }
};

exports.markAsUnread = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: false },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error marking email as unread: ' + error);
  }
};

exports.starEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { starred: true },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error starring email: ' + error);
  }
};

exports.unstarEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { starred: false },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error unstarring email: ' + error);
  }
};

exports.moveEmail = async (req, res) => {
  try {
    const { folder } = req.body;
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { folder },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error moving email: ' + error);
  }
};

exports.deleteEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { folder: 'trash' },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error deleting email: ' + error);
  }
};

exports.permanentlyDeleteEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.send('Email permanently deleted.');
  } catch (error) {
    res.status(500).send('Error permanently deleting email: ' + error);
  }
};

exports.snoozeEmail = async (req, res) => {
  try {
    const { snoozedUntil } = req.body;
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { snoozedUntil },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error snoozing email: ' + error);
  }
};

exports.archiveEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { folder: 'archive' },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error archiving email: ' + error);
  }
};

exports.markAsSpam = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isSpam: true, folder: 'spam' },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error marking email as spam: ' + error);
  }
};

exports.unmarkAsSpam = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isSpam: false, folder: 'inbox' },
      { new: true }
    );
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.json(email);
  } catch (error) {
    res.status(500).send('Error unmarking email as spam: ' + error);
  }
};