const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const MealsSchema = new mongoose.Schema({
   owner:{type: Schema.Types.ObjectId , ref: 'DietPlan'},
   time: {type:String},
   items: {type: Array}
})

module.exports = mongoose.model('Meals' , MealsSchema) 