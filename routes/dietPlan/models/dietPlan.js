const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const Meals = require('../../meals/models/Meals')

const DietPlanSchema = new mongoose.Schema({
    owner:{type: Schema.Types.ObjectId , ref: 'User'},
    meals: [
        {
            meals: { type: Schema.Types.ObjectId, ref: 'Meals' }
        }
    ],
    number: {type: Number},
    date: {type:String},
    // totalCalories: {type:Number, default: 0}
})


// DietPlanSchema.pre('save' , function(next){

//     const DietPlan = this

//     if(DietPlan.meals.length > 0){

//         Meal.find({owner: DietPlan._id})
//         .populate('meals.meals')
//         .exec((err , foundPlan) => {
//             if(err) return next(err)
//             DietPlan.totalCalories  = DietPlan.meals.reduce((a,b) => 
//             a+Number(b.totalCalories),0)
//         })
//     }
//     next()
//  })
 

module.exports = mongoose.model('DietPlan' , DietPlanSchema)


