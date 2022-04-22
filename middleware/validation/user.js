const {check, validationResult} = require('express-validator');

exports.validateUserSignUp =[
    check('name')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 5, max: 50})
        .withMessage('Le champ (nom) ne peut pas être vide et ne peut pas contenir moins de 5 caractères et plus de 50 caractères.'),
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

exports.validateUserLogin =[
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

exports.registerValidation= (req, res, next) =>{
    const result = validationResult(req).array()
    if(!result.length){
        next()
    }   const error = result.filter(err => err.msg).map(err => err.msg)
    res.json({
        success: false,
        message: error
    })

}
exports.loginValidation = (req, res, next) =>{
    const result = validationResult(req).array()
    if(!result.length){
        next()
    }   const error = result.filter(err => err.msg).map(err => err.msg)
    if(error.length>0){
        res.json({
            success: false,
            message: error
        })
    }
}

