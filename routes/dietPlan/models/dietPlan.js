const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const DietPlanSchema = new mongoose.Schema({
    owner:{type: Schema.Types.ObjectId , ref: 'User'},
    meals: [
        {
            meal: { type: Schema.Types.ObjectId, ref: 'Meal' }
        }
    ],
    
    timestamp: {type:String , default: ()=> moment().format('MMMM Do YYYY, h:mm:ss a')}
})

module.exports = mongoose.model('DietPlan' , DietPlanSchema)