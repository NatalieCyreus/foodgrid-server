const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: String,
  category: [{type: String}],
  about: String,
  ingredients: [{type: String}],
  directions: [{type: String}],
  likes: Number,
  userId: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref:'comments'
  }],
},{
  usePushEach: true
});

recipeSchema.statics.addComment = function (text, recipeId, userId) {
  const Comment = mongoose.model('comment');

  return this.findById(recipeId)
  .then(recipe => {
    const comment = new Comment({text, recipe, userId})
    recipe.comment.push(comment)
    return Promise.all([comment.save(), recipe.save()])
    .then(([comment, recipe]) => recipe);
  });
};


recipeSchema.statics.findComment = function(id) {
  return this.findById(id)
    .populate('comment')
    .then(recipe => recipe.comment);
}


module.exports = mongoose.model('recipe', recipeSchema);
