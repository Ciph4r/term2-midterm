const mongoose = require('mongoose')
const moment = require('moment')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    // accountInfo: {
    //     name:{type:String, default:""},
    //     email: {type:String , unique:  true , lowercase:true , required: true},
    //     password: {type:String , min: 6 , required:true}
    // },
    name:{type:String, default:""},
    email: {type:String , unique:  true , lowercase:true , required: true},
    password: {type:String , min: 6 , required:true},
    userInfo: {
        gender: {type:String, default:""},
        birthday: {type:String, default:""},
        height: {type:String, default:""},
        tdde: {type:String, default:""},
        bmr: {type:String, default:""},
        weight: {type:Array},
        userInfo: {type:Boolean , default:false}
    },
    goal:{
        currentWeight: {type:String, default: ""},
        targetWeight: {type: String, default: ""},
        complete:{type:Boolean, default: false},
        pastGoal: {type: Array}
    },
    auth: {type:Boolean , default: false},
    timestamp: {type:String , default: ()=> moment().format('MMMM Do YYYY, h:mm:ss a')}
})

UserSchema.pre('save' , function(next){
    const user = this

    if(!user.isModified('password')) return next()

    bcrypt.genSalt(10 , (err , salt) => {
        if (err) return next(err)

        bcrypt.hash(user.password , salt , (err , hash) => {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})


module.exports = mongoose.model('User' , UserSchema)