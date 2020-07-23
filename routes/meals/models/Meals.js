const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const MealsSchema = new mongoose.Schema({
   owner:{type: Schema.Types.ObjectId , ref: 'DietPlan'},
   time: {type:String},
   items: {type: Array},
   totalCalories: {type:Number , default: 0}
})



MealsSchema.pre('save' , function(next){
   const meals = this
   if(meals.items.length > 0){
      meals.totalCalories = meals.items.reduce((a,b) => 
         a+Number(b.calories),0)
   }
   next()
})

module.exports = mongoose.model('Meals' , MealsSchema) 