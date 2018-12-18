const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  text: { type: String },
  complete: { type: Boolean },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'recipe'
  }
});

module.exports = mongoose.model('ingredient', ingredientSchema);
