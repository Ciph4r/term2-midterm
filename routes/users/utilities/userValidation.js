const {check} = require('express-validator')


const userValidation = [
    check('name' ,'Name is required').not().isEmpty(),
    check('email' ,'pls included valid email').isEmail(),

  ]

module.exports = userValidation