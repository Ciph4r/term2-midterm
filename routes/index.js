const express = require('express');
const router = express.Router();
const Meals = require('./meals/models/Meals')
const User = require('./users/models/User')
const DietPlan = require('./dietPlan/models/dietPlan')
const moment = require('moment')
const mailjet = require('node-mailjet')
  .connect(process.env.MAILKEY, process.env.MAILSECRET)
/* GET home page. */

const convertMS = ( milliseconds ) => {
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
      
    let diet = await Meals.find()
    let recentDiet = []
  
    for (let i = diet.length -1 ; i >= 0 ; i--){
        let num = 0
      if(diet[i].items.length && num < 3){
        recentDiet.push(diet[i].items)
        num ++
      }
    }
    
    if(req.user){
      if(req.user.userInfo.userInfo){
        let user =  await User.findOne({email: req.user.email})
      
        const lastWeight = user.userInfo.weight[user.userInfo.weight.length-1].date
        let date = lastWeight.split(',')
        let hours = date[1].split(' ')

        let milliSec = new Date(`${date[0]} ${hours[1]}`).getTime()
        let now = new Date(Date.now())
       //////////////////
       let time = {
         show: false
       }
        if(hours[2] === 'pm'){
          milliSec += 43200000
        }
        if((now.getTime() - milliSec ) > 120000){
          let timePassed = convertMS((now.getTime() - milliSec))
          time.header = ` ${timePassed.day}Days, ${timePassed.hour}Hours, ${timePassed.minute}Minutes have passed since last weight In`
          time.show = true
          // req.flash('weighIn' , ` ${timePassed.day}Days, ${timePassed.hour}Hours, ${timePassed.minute}Minutes have passed since last weight In`)
        }
//////////////////////////////////////////
          let userDiet = await DietPlan.find({owner: req.user._id})
          .populate('meals.meals')
          let userRecentDiet = []
          let num = 0
          for (let i = userDiet.length -1 ; i >= 0 ; i--){
            if(num  < 3)
              userRecentDiet.push(userDiet[i])
             num ++
          }
    
           return res.render('main/home' ,{recentDiet , userRecentDiet , time})


      }

           
             }
             return res.render('main/home' ,{recentDiet});
  }

  catch(err){
    console.log(err)
  }
  
});


router.get('/contact',(req,res,next)=> {
  res.render('main/contact')
})
router.post('/contact',async (req,res,next)=> {

  const {name,email,message} = req.body

  try{

    const request = mailjet
    .post("send", {
      'version': 'v3.1'
    })
    .request({
      "Messages": [{
        "From": {
          "Email": "david.lau@codeimmersives.com",
          "Name": "Dave"
        },
        "To": [{
          "Email": 'david.lau@codeimmersives.com',
          "Name": ''
        }],
        "Subject": "Lost It Suggestion.",
        "TextPart": "",
        "HTMLPart": `From :${name} contact: ${email} message: ${message}`,
        "CustomID": ""
      }]
    })
     request
    .then((result) => {
      req.flash('success', 'Message sent');
      return res.redirect(301, 'back')
    })
    .catch((err) => {
        console.log(err)
      req.flash('errors', 'register sucessful, email server down');
      return res.redirect('back')
    })

  }



  catch(err){
    throw next(err)
  }


})


module.exports = router;
