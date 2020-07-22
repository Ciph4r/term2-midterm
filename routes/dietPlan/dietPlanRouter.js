const express = require('express');
const router = express.Router();
const DietPlan = require('./models/dietPlan')
const User = require('../users/models/User')
const Meals = require('../meals/models/Meals')
const auth = require('../middleware/auth');
const { query } = require('express');
const Meal = require('../meal/models/Meal');
const { check , validationResult } = require('express-validator');
const {addDiet, findFood , addFood} = require('./controller/dietPlanController.')
require('dotenv').config()



const searchValidation = [
    check('search' ,'Search Input is required').not().isEmpty(),
  ]

  const dietValidation = [
    check('mealDate' ,'Date is required').not().isEmpty(),
    check('mealNum' ,'Meal Number is required').not().isEmpty()
  ]



router.get('/' , (req,res,next) => {
    DietPlan.find({owner: req.user._id}).then((foundDiet) => {
        
        if (foundDiet){
            return res.render('auth/diet' , {diet: foundDiet})
        }else {
            return res.render('auth/diet')
        }
        
    })
    .catch((err) => {
        console.log(err)
    })
 


})

router.post('/add-diet' , dietValidation, addDiet)

router.get('/add-meal' , (req,res,next) => {
    return res.render('auth/addMeals')
})

router.get('/show-meals/:dietPlan_id' , (req,res,next) => {
    Meal.find({owner: req.params.dietPlan_id})
    .populate('meals.meals')
    .exec((err , foundPlan) => {
        if(err) return next(err)
        return res.render('auth/meals' , {foundPlan})
    })
})


router.get('/food-search/:meals_id' ,(req,res,next) => {
 

    Meals.findOne({_id : req.params.meals_id}).then((foundMeal) => {
        let data = {}
        return res.render('auth/foodSearch', {data ,foundMeal} )    
    })
})




router.get('/findfood', searchValidation ,findFood)


router.put('/add-food' , addFood)



  module.exports = router;

