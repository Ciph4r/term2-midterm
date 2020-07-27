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
    
})




module.exports = mongoose.model('DietPlan' , DietPlanSchema)


