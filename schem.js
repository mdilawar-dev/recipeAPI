const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter an title'],
    unique: true
  },
  image: {
    type: String,
    required: [true]
  },
  ingredients: [String],
  instructions:[String],
  nutrition: {
    nutrients: [
        {
            title: [String],
            amount: [Number],
            unit: [String]
        }
    ]
}
 

});



const recipe= mongoose.model('recipecollection', recipeSchema);

module.exports = recipe;

