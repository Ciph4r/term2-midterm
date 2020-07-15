const express = require('express');
const router = express.Router();
const User = require('./models/User');
const passport = require('passport');
const { check , validationResult } = require('express-validator');
const { register , registerUpdate , registerComplete , account , profile , profileEdit} = require('./controller/userController');
const auth = require('../middleware/auth')



const userRegistrationValidation = [
    check('fName' ,'First Name is required').not().isEmpty(),
    check('lName' ,'Last Name is required').not().isEmpty(),
    check('password' ,'Password must be 6 character long').isLength({min:6}),
  ]

  const loginValidation = [
    check('email' ,'Email is required').not().isEmpty(),
    check('password' ,'Password is required').not().isEmpty(),
  ]


  const checkLoginField = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('errors', errors.errors[0].msg)
        return res.redirect('/api/v1/users/login')
    }
    next()
  }

//////////////////////////////////////


router.get('/', function(req, res, next) {
    return res.render('main/home');
  });


router.post('/register' , register);

router.get('/register-update/:name/:password' , registerUpdate)
router.put('/register-Complete', userRegistrationValidation, registerComplete)


  router.get('/login' ,  (req,res,next) => {
    if (req.isAuthenticated()){
      return res.redirect(301,'/')
    }
    return res.render('main/login')
  })

  router.post('/login' ,loginValidation, checkLoginField, passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/api/v1/users/login',
    failureFlash:true
  })
  );

  router.get('/logout', (req, res) => {
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: null
    });
    req.session.destroy();
    return res.redirect('/');
  });

router.get('/account' , auth, (req,res,next) => {
      return res.render('auth/account')
  })

router.put('/account', auth , account)

 router.get('/profile' , auth , (req,res,next) => {
   if (!req.user.userInfo.userInfo){
    return res.render('auth/profileUpdate')
   }
    return res.render('auth/profile')
})
router.put('/profile' , auth , profile)

router.get('/profileEdit' ,auth , (req,res,next) => {
  return res.render('auth/profileUpdate')
})

router.get('/add-goal', auth,(req,res,next) => {
  res.render('auth/addGoal')
})


  module.exports = router;