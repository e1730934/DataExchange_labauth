const {check, validationResult} = require('express-validator');

exports.validateUserSignUp =[
    check('name')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 3, max: 20})
        .withMessage('Name must be between 3 and 20 characters'),
    check('email').normalizeEmail()
        .isEmail()
        .withMessage('Email is invalid'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 8, max: 20})
        .withMessage('Password must be between 8 and 20 characters'),
]

exports.userValidation= (req, res, next) =>{
    const result = validationResult(req).array()
    if(!result.length){
        next()
    }   const error = result.filter(err => err.msg).map(err => err.msg)
        res.json({
            success: false,
            message: error
        })

}

