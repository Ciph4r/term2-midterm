const express = require('express');
const router = express.Router();
const DietPlan = require('./models/dietPlan')
const auth = require('../middleware/auth');
const app = require('../../app');



router.post('/add-diet' , async (req,res,next) => {
    try {
        let dietPlan = await new dietPlan()
        dietPlan.owner = req.user._id
        await dietPlan.save()
    }
    catch(err){
        console.log(err)
    }
})


  module.exports = router;
  