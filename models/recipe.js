const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: String,
  category: [String],
  about: String,
  ingredients: [{
    type: Schema.Types.ObjectId,
    ref:'ingredient'
  }],
  directions: [String],
  likes: Number,
  userId: String,
},{
  usePushEach: true
});

recipeSchema.statics.addIngredient = function (text, recipeId, complete) {
  const Ingredient = mongoose.model('ingredient');

  return this.findById(recipeId)
  .then(recipe => {
    const ingredient = new Ingredient({text, complete:false, recipe})
    recipe.ingredients.push(ingredient)
    return Promise.all([ingredient.save(), recipe.save()])
    .then(([ingredient, recipe]) => recipe);
  });
};


recipeSchema.statics.findIngredients = function(id) {
  return this.findById(id)
    .populate('ingredients')
    .then(recipe => recipe.ingredients);
}


module.exports = mongoose.model('recipe', recipeSchema);
