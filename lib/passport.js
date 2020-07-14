const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../routes/users/models/User')
const bcrypt = require('bcryptjs')


passport.serializeUser((user, done) => {
    done(null, user._id)
})


passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user)
    })
})


const authenticatePassword = async (inputPassword , user , done , req) => {
    const exist = await bcrypt.compare(inputPassword , user.password)

    if(!exist){
        return done(null , false , req.flash('errors' , 'Check Email or Password'))
    }
    return done(null,user)
}

const verifyCallback = async (req, email , password , done) => {
    await User.findOne({email} , (err,user) => {
        try {
            if(!user) {
                return done(null , false , req.flash('errors' , 'Check Email or Password'))
            }

            authenticatePassword(password , user , done, req)
        } catch (error) {
            done(error , null)
        }
    })
}


passport.use('local-login' , new localStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
},
verifyCallback
))