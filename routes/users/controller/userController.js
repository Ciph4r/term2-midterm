const User = require('../models/User')
const nanoid = require('nanoid')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const mailjet = require('node-mailjet')
  .connect(process.env.MAILKEY, process.env.MAILSECRET)
const { check , validationResult } = require('express-validator');
const moment = require('moment')
const {bmrCalc , tdeeCalc} = require('../helper/bmrTddeCalc')
const birthdayCalc = require('../helper/birhdayCalc')
const calPerDay = require('../helper/calPerDay')





  

module.exports = {

    register: async(req,res,next) => {
        try {
            const {email} = req.body
            let user = await User.findOne({email})

            if(user){
                req.flash('errors' , 'User exist')
                return res.redirect('/api/v1/users/')
            }
            const name = nanoid.nanoid(10)
            const password = nanoid.nanoid(10)

            user = await new User({name ,email , password })
            
            await user.save().then((user)=> {
                
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
                      "Email": email,
                      "Name": email
                    }],
                    "Subject": "Greetings from Lost It.",
                    "TextPart": "",
                    "HTMLPart": `<h3>Dear ${email}, welcome to <a href='http://localhost:3000/api/v1/users/register-update/${name}/${password}'>Lost It</a>!</h3><br />Click on the provided link to complete setup and your temp password is ${password}`,
                    "CustomID": ""
                  }]
                })
                 request
                .then((result) => {
                  req.flash('success', 'THANK YOU FOR REGISTERING , CHECK YOUR EMAIL');
                  return res.redirect(301, '/api/v1/users/')
                })
                .catch((err) => {
                    console.log(err)
                  req.flash('errors', 'register sucessful, email server down');
                  return res.redirect('/api/v1/users/')
                })
            })
            .catch((err)=> {
                req.flash('errors', 'Register Failed')
                return res.redirect('/api/v1/users/')
            })

        }
        catch(err){
            // return res.status(500).json({errors: errors.array()})
            return res.status(500).json({message: 'catch error'})
        }
    },

    registerUpdate : async (req,res,next) => {
        try{
                const {name , password} = req.params
                let user = await User.findOne({name})
                if(user){
                    if(!user.auth){
                        const match = await bcrypt.compare(password, user.password)
                        if(match){
                            return res.render('auth/register-update', {name , password})
                        }
                    }
                }
                
                return res.render('error' , {errors: 'THIS PAGE NO LONGER EXIST'})
        }
        catch(err){
            return res.render('error' , {errors: err})
        }
    },

    registerComplete: async (req,res,next) => {
      const {fName , lName, password , retypePassword, tempPassword , tempName} = req.body
      const errors = validationResult(req)
      const back = `/api/v1/users/register-update/${tempName}/${tempPassword}`
      if(!errors.isEmpty()){
          req.flash('errors' , errors.array()[0].msg)
          return res.redirect(back)
    
      }

        
        
        try {
            let user = await User.findOne({name: tempName})
  
            if(password !== retypePassword){
                req.flash('errors' , 'Password Dont Match')
                return res.redirect(back)
            }
            user.name = `${fName} ${lName}`
            user.password = password
            user.auth = true
            await user.save()
            await req.login(user , (err) => {
              if (err) {
                  return res.status(400).json({comfirmation: 'false' , msg: err})
              }else {
                  return res.redirect('/')
              }
          })
        }
        catch(err){
           return res.render('error' , {errors: err})
        }
    },

    account: async (req, res,next) => {
      const {fName , lName, email, password ,  nPassword , retypeNPassword} = req.body
      const back = '/api/v1/users/account'

    

      try {
        let user = await User.findOne({email: req.user.email})
        const newEmail = await User.findOne({email})
        const match = await bcrypt.compare(password, user.password)

        if(newEmail){
          req.flash('errors' , 'Email Already Registered')
          return res.redirect(back)
        }

        if(!match){
          req.flash('errors' , 'Invalid Password')
          return res.redirect(back)
        }
        if(nPassword !== retypeNPassword){
          req.flash('errors' , 'New Password Need to Match')
          return res.redirect(back)
        }

        user.name = fName ? `${fName} ${lName}` : user.name
        user.email = email ? email : user.email
        if(password && nPassword && retypeNPassword){
          if(nPassword.length < 6){
            req.flash('errors' , 'New Password Must be 6 Character Long')
            return res.redirect(back)
          }
            user.password = nPassword
        }
        await user.save()
        req.flash('success' , 'Account Updated')
        return res.redirect(back)
      }

       catch(err){
        console.log(err)
      }

   },

   profile: async (req,res,next) => {
    const {gender , birthday, ftHeight, inchHeight, weight ,  activityLV } = req.body
    const back = '/api/v1/users/profile'
     try {
      let user = await User.findOne({email: req.user.email})
      user.userInfo.gender = gender
      user.userInfo.birthday = birthday
      user.userInfo.height = (ftHeight*12) + (inchHeight * 1)
      user.userInfo.weight.push({
        date: moment().format("YYYY-MM-DD , h:mm:ss a"),
        weight:weight
      })
      user.userInfo.activityLV = activityLV
      user.userInfo.userInfo = true
      user.goal.currentWeight = weight
  
      const date = birthday.split('-')
      const age = birthdayCalc(new Date(Number(date[0]), Number(date[1]), Number(date[2])))
      user.userInfo.bmr = bmrCalc(gender , age , (weight*1) / 2.205, user.userInfo.height *2.54)
      user.userInfo.userInfo = true
      user.userInfo.tdee = tdeeCalc(user.userInfo.bmr , activityLV)
      
      await user.save()
      req.flash('success' , 'Profile Updated')
      return res.redirect(back)

     }
     catch(err){
      console.log(err)
     }

   },
   profileEdit: async (req,res,next) =>{
    
    try{
      return res.render('auth/profileEdit')
    }
    catch(err){
      console.log(err)
    }
   },

   addGoal: async (req,res,next) => { 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      req.flash('errors' , errors.array()[0].msg)
      return res.redirect('back')
  }

     try{
      let user = await User.findOne({email: req.user.email})
      if(user.goal.complete){
        user.goal.pastGoal.push(
          {
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            endGoalWeight: user.goal.currentWeight,
            targetWeight: user.goal.targetWeight,
          }
        )
        if(user.goal.pastGoal.length > 0){
          user.userInfo.weight.push({
            date: moment().format("YYYY-MM-DD , h:mm:ss a"),
            weight: user.goal.currentWeight
          })
        }
      }
      const {gender , birthday, height,  activityLV } = user.userInfo
      let {weight , targetWeight ,completeDate} = req.body
      const date = birthday.split('-')
      const age = birthdayCalc(new Date(Number(date[0]), Number(date[1]), Number(date[2])))
      let bmr = bmrCalc(gender , age , (weight*1) / 2.205, height *2.54)
      ////////////////////////////////////////


     
  
      ////////////////////////////////////
      user.goal.targetWeight = targetWeight
      user.goal.currentWeight = weight
      user.userInfo.tdee = tdeeCalc(bmr , activityLV)
      user.goal.completeDate = completeDate
      user.goal.complete = true
     
    
      const perDay = calPerDay(completeDate , weight,targetWeight,user.userInfo.tdee)
      if(!perDay){
        req.flash('errors' , 'Unrealistic Goal')
        return res.redirect('back')
      }
       user.goal.calPerDay = perDay
      await user.save()
      req.flash('success' , 'Goal Updated')
      return res.redirect('/api/v1/users/profile')
     }
     catch(err){
        console.log(err)
     }
   },


   weighIn: async (req,res,next) => {
    try {
      let user = await User.findOne({email: req.user.email})
      user.userInfo.weight.push({
        date: moment().format("YYYY-MM-DD , h:mm:ss a"),
        weight:user.goal.currentWeight
      })
      user.goal.currentWeight = req.body.weight
      await user.save()
      req.flash('success' , 'Weight Updated')
      return res.redirect('back')
    }
    catch(err){
      console.log(err)
    }
  }




}