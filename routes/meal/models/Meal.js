const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const MealSchema = new mongoose.Schema({
   owner:{type: Schema.Types.ObjectId , ref: 'Meals'},
   time: {type:String},
   items: {type: Array}
})

module.exports = mongoose.model('Meal' , MealSchema) 