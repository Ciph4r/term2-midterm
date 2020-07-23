
    const { check , validationResult } = require('express-validator');
    
    
    const userRegistrationValidation = [
        check('fName' ,'First Name is required').not().isEmpty(),
        check('lName' ,'Last Name is required').not().isEmpty(),
        check('password' ,'Password must be 6 character long').isLength({min:6}),
      ]
    
      const loginValidation = [
        check('email' ,'Email is required').not().isEmpty(),
        check('password' ,'Password is required').not().isEmpty(),
      ]
    
      const goalValidation = [
        check('weight' ,'weight is required').not().isEmpty(),
        check('targetWeight' ,'Goal is required').not().isEmpty(),
        check('completeDate' ,'Date is required').not().isEmpty(),
      ]
      
module.exports = {userRegistrationValidation , loginValidation ,goalValidation}