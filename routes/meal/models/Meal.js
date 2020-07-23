const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MealSchema = new mongoose.Schema({
   owner:{type: Schema.Types.ObjectId , ref: 'Meals'},
   time: {type:String},
   items: {type: Array},
   totalCalories: {type:Number}
})



//  MealSchema.pre('save' , function(next){
//    const meal = this
   
//    if(meal.items.length){
//       totalCalories = meals.items.reduce((a,b) => {
//          a +
//       })
//    }
  
// })

module.exports = mongoose.model('Meal' , MealSchema) 