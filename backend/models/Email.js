const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, required: true },
  recipients: [String],
  subject: { type: String, required: true },
  body: { type: String, required: true },
  attachments: [String],
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  starred: { type: Boolean, default: false },
  folder: { type: String, default: 'inbox' },
  priority: { type: String, enum: ['high', 'low'], default: 'low' },
  snoozedUntil: { type: Date, default: null },
  isSpam: { type: Boolean, default: false },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email' } // Add threadId to group emails
});

module.exports = mongoose.model('Email', EmailSchema);