const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  displayName: { type: String },
  email: { type: String, required: true, unique: true },
  photo: { type: String },
  token: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
