const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }
});

const Label = mongoose.model('Label', LabelSchema);
module.exports = Label;
