const express = require('express');
const router = express.Router();
const DietPlan = require('./models/dietPlan')
const User = require('../users/models/User')
const Meals = require('../meals/models/Meals')
const auth = require('../middleware/auth');
const moment = require('moment')
const app = require('../../app');
const axios = require('axios');
const { query } = require('express');
const Meal = require('../meal/models/Meal');
const { check , validationResult } = require('express-validator');
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

router.post('/add-diet' , dietValidation, async (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('errors' , errors.array()[0].msg)
        return res.redirect('back')
  
    }
    try {
        let diet = await DietPlan.find({date: req.body.mealDate })
        if (diet.length){
            req.flash('errors' , " this date already exist")
            return res.redirect('back')
        }
        let dietPlan = await new DietPlan()
        dietPlan.owner = req.user._id
        dietPlan.date = req.body.mealDate
        for (let i = 0 ; i < req.body.mealQuantity ; i++){
            let meals = await new Meals()
            dietPlan.meals.push(meals._id)
            meals.owner = dietPlan._id
            meals.time= req.body[`mealTime${i}`] 
            await meals.save()
        }       
                await dietPlan.save()
                return res.redirect('/api/v1/dietPlan/show-meals/'+ dietPlan._id)
    }
    catch (err){
        console.log(err)
    }
  
})

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




router.get('/findfood', searchValidation ,async (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('errors' , errors.array()[0].msg)
        return res.redirect('back')
  
    }

        try {
            let foundMeal = await Meals.findOne({_id: req.query.mealId})
  
        const search = req.query.search.split(' ').join('%20')
        const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${search}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`)
            if(!response.data.parsed.length){
                req.flash('errors', `CANT FIND ${req.query.search}`)
                return res.redirect('back')
            }
       
        let data = await response.data
        return res.render('auth/foodSearch' , {data: data , foundMeal})
      
          
    }
    catch(err) {
    console.log(err)
    }
})


router.put('/add-food' , (req,res,next) => {
    const {calories , fat , protein , name, serving} = req.body
    const mealId = req.body.mealId
    Meals.findOne({_id : mealId}).then((foundMeal) => {
    foundMeal.items.push({
      name,
      calories,
      fat,
      protein,
      serving
     })
    foundMeal.save().then(()=> {
        res.redirect('back')
    })            
               
    })
    .catch((err) => console.log(err))
    
})
router.put('/remove-item/:meal_id' , async (req,res,next) => {
    try {
        let meal = await Meals.findOne({_id:req.params.meal_id })
        meal.items.splice(req.body.index,1)
        
        await meal.save()
        req.flash('success' , 'Item Remove')
        res.redirect('back')
    }
    catch(err){
        console.log(err)
    }
   
})



  module.exports = router;

