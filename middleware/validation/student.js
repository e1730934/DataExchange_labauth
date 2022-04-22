const {check, validationResult} = require('express-validator');

exports.validationAddStudent = [
    //- Les champs (prénom et nom) ne peuvent pas être vides et ne peuvent pas contenir moins de 5 caractères et plus de 20 caractères.
    // - Le champ (email) doit être valide.
    check('first_name')
        .not()
        .isEmpty()
        .withMessage('Le prénom est obligatoire')
        .isLength({
        min: 5,
        max: 20
    }).withMessage('Le prénom doit contenir entre 5 et 20 caractères'),
    check('last_name')
        .not()
        .isEmpty()
        .withMessage('Le nom est obligatoire')
        .isLength({
        min: 5,
        max: 20
    }).withMessage('Le nom doit contenir entre 5 et 20 caractères'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('L\'email est obligatoire')
        .isEmail()
        .withMessage('L\'email doit être valide')
]

exports.validationEditStudent = [
    check('id')
        .not()
        .isEmpty()
        .withMessage('L\'id est obligatoire'),
]

exports.addStudentValidation = (req, res, next) =>{
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
