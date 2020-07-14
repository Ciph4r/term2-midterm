const express = require('express');
const router = express.Router();
const User = require('./models/User');
const passport = require('passport');
const { register , registerUpdate , registerComplete} = require('./controller/userController');
const { check ,validationResult } = require('express-validator');



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
    res.render('main/test');
  });


router.post('/register' , register);

router.get('/register-update/:name/:password' , registerUpdate)
router.post('/register-Complete', userRegistrationValidation, registerComplete)


  router.get('/login' ,  (req,res,next) => {
    if (req.isAuthenticated()){
      res.redirect(301,'/')
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

  module.exports = router;