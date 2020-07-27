const DietPlan = require('../../dietPlan/models/dietPlan')
const Meals = require('../../meals/models/Meals')
const axios = require('axios')
require('dotenv').config()

const { check , validationResult } = require('express-validator');





module.exports = {
    home : (req,res,next) => {
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
    },
    // home : (req,res,next) => {

    //     DietPlan.find({owner: req.user._id}).then((foundDiet) => {
            
    //      for (let i = 0 ; i > foundDiet.length; i++){
            
    //         Meals.findOne({owner: foundDiet._id})
    //         .populate('meals')

    //      }
    



    //         if (foundDiet){
               
    //             return res.render('auth/diet' , {diet: foundDiet})
    //         }else {
    //             return res.render('auth/diet')
    //         }    
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
    // },
    
    addDiet : async (req,res,next) => {
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
      
    },
    findFood: async (req,res,next) => {
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
    },
    addFood: (req,res,next) => {
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
        
    },

    removeItem : async (req,res,next) => {
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
       
    }


}