const mongoose = require('mongoose')

 
const MealsSchema = new mongoose.Schema({
   date: {type:String},
   number: {type: Number},
   meal: {type: Array}
})

module.exports = mongoose.model('Meals' , MealsSchema) 