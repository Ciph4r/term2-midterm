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
require('dotenv').config()





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


//////////////////////////

router.post('/add-diet' , async (req,res,next) => {

    try {
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

        // DietPlan.findOne({_id : req.params.dietPlan_id}).then((foundPlan) => {
         
        //     return res.render('auth/meals' , {plan: foundPlan} )
        // })
        // .catch((err) => console.log(err))
   
})


router.get('/food-search/:meals_id' ,(req,res,next) => {
    Meals.findOne({_id : req.params.meals_id}).then((foundMeal) => {
        // const target = {
        //     id: req.params.meals_id,
        //     time: req.params.time,
        //     meals: meals
        // }
        let data = {}
        // // console.log(foundMeal)
        return res.render('auth/foodSearch', {data ,foundMeal} )    
    })
})




router.get('/findfood' ,async (req,res,next) => {
        try {
            let foundMeal = await Meals.findOne({_id: req.query.mealId})
  
        const search = req.query.search.split(' ').join('%20')
        const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${search}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`)
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

// router.post('/findfood' , async (req,res,next) => {
//     try {
//         console.log(req.body.search)
//         const search = req.body.search.split(' ').join('%20')
//         const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${search}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`)
//         let data = await response.data
//         // console.log(response.data)
//         return res.render('auth/foodSearch' , {data: data})
//         res.redirect('/api/v1/dietPlan/food-search' , {})
        
//             return res.send(response.data)   
//     }
//     catch(err) {
//     console.log(err)
//     }
// })


  module.exports = router;

