const express = require('express');
const router = express.Router();
const Meals = require('./meals/models/Meals')
const User = require('./users/models/User')
/* GET home page. */

let convertMS = ( milliseconds ) => {
  let day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
  };
}



router.get('/', async function (req, res, next) {

  try {
    if(req.user){
      let user =  await User.findOne({email: req.user.email})
      if(user){
        const lastWeight = user.userInfo.weight[user.userInfo.weight.length-1].date


        // req.flash('errors' , `${lastWeight}`)
        let date = lastWeight.split(',')
        let hours = date[1].split(' ')[1]
        let milliSec = new Date(`${date[0]} ${hours}`).getTime()
        let now = new Date(Date.now())
       //////////////////
        if((now.getTime() - milliSec) > 120000){
          let timePassed = convertMS((now.getTime() - milliSec))
          console.log(timePassed)
          req.flash('weighIn' , ` ${timePassed.day}Days ,${timePassed.hour}Hours ,${timePassed.minute}Minutes have passed since last weight In`)
        }
//////////////////////////////////////////
      }
    }

    let diet = await Meals.find()
    let recentDiet = []
  
    for (let i = diet.length -1 ; i >= 0 ; i--){
        let num = 0
      if(diet[i].items.length && num < 3){
        recentDiet.push(diet[i].items)
        num ++
      }
    }
    
    return res.render('main/home' ,{recentDiet});
  }

  catch(err){
    console.log(err)
  }
  
});

module.exports = router;
