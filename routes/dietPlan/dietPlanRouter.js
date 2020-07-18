const express = require('express');
const router = express.Router();
const DietPlan = require('./models/dietPlan')
const User = require('../users/models/User')
const Meals = require('../meals/models/Meals')
const auth = require('../middleware/auth');
const moment = require('moment')
const app = require('../../app');
const axios = require('axios')
require('dotenv').config()





router.get('/' , (req,res,next) => {
    return res.render('auth/diet')
})

// router.post('/add-diet' , async (req,res,next) => {
//     try {
//         let dietPlan = await new dietPlan()
//         dietPlan.owner = req.user._id
//         await dietPlan.save()
//     }
//     catch(err){
//         console.log(err)
//     }
// })
//////////////////////////////////////   test routes
router.get('/findfood' , async (req,res,next) => {
    try {
        const search = req.body.search.split(' ').join('%20')
        const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${search}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`)
       
        console.log(response.data)
            return res.send(response.data)   
    }
    catch(err) {
    console.log(err)
    }
})

//////////////////////////

router.post('/add-diet' , async (req,res,next) => {

    try {
        let dietPlan = await new DietPlan()
        let meals = await new Meals()
        dietPlan.owner = req.user._id
        dietPlan.date = req.body.mealDate

        dietPlan.meals.push(meals)

        for (let i = 0 ; i < req.body.mealQuantity ; i++){
            const meal = {
             time: req.body.mealTime + i    
            }
           
            meals.meal.push(meal)
            console.log(req.body[mealTime0])
        }
        
        // console.log(dietPlan)
        // console.log(meals)

        // await dietPlan.save()
        



    }
    catch (err){
        console.log(err)
    }
  
})

router.get('/add-meal' , (req,res,next) => {
    return res.render('auth/addMeals')
})

router.post('add-meal' ,(req,res,next) => {
    const mealQuantity = res.body.mealQuantity
    console.log(mealQuantity)
})




  module.exports = router;

