const express = require('express');
const router = express.Router();
const DietPlan = require('./models/dietPlan')
const auth = require('../middleware/auth');
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

router.post('/add-diet' , async (re,res,next) => {


  
})




  module.exports = router;

