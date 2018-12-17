const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: String,
  category: [String],
  about: String,
  ingredients: [String],
  directions: [String],
  likes: Number,
  userId: String,
});

module.exports = mongoose.model('Recipe', recipeSchema);
