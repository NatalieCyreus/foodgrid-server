const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String },
  userId: { type: String },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'recipe'
  }
});

module.exports = mongoose.model('comment', commentSchema);
