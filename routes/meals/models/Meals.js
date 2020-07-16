const mongoose = require('mongoose')


const MealSchema = new mongoose.Schema({
   date: {type:String},
   meal: {type: Array}
})

module.exports = mongoose.model('Meal' , MealsSchema) 