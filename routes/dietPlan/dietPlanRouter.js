const express = require('express');
const router = express.Router();
const Meals = require('../meals/models/Meals')
const auth = require('../middleware/auth');
const { check , validationResult } = require('express-validator');
const {home , addDiet, findFood , addFood , removeItem} = require('./controller/dietPlanController.')

const searchValidation = [
    check('search' ,'Search Input is required').not().isEmpty(),
  ]

  const dietValidation = [
    check('mealDate' ,'Date is required').not().isEmpty(),
    check('mealNum' ,'Meal Number is required').not().isEmpty()
  ]

router.get('/' , auth, home)

router.post('/add-diet' , auth, dietValidation, addDiet)

router.get('/add-meal' ,auth , (req,res,next) => {
    return res.render('auth/addMeals')
})

router.get('/show-meals/:dietPlan_id' , auth, (req,res,next) => {
    Meals.find({owner: req.params.dietPlan_id})
    .populate('meals.meals')
    .exec((err , foundPlan) => {
        if(err) return next(err)
        return res.render('auth/meals' , {foundPlan})
    })
})

router.get('/food-search/:meals_id' , auth, (req,res,next) => {
    Meals.findOne({_id : req.params.meals_id}).then((foundMeal) => {
        let data = {}
        return res.render('auth/foodSearch', {data ,foundMeal} )    
    })
})

router.get('/findfood',auth , searchValidation ,findFood)
router.put('/add-food' , auth ,addFood)
router.put('/remove-item/:meal_id' ,auth , removeItem)

  module.exports = router;

