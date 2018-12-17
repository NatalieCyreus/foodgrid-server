const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  username: String,
  name: String,
  about: String,
  followers: Number,
});

module.exports = mongoose.model('User', userSchema);
