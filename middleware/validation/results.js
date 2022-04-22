const {check, validationResult} = require('express-validator');

exports.validationAddResult = [
    check('student_id')
        .not()
        .isEmpty()
        .withMessage('L\'id est obligatoire'),
    check('eval_id')
        .not()
        .isEmpty()
        .withMessage('L\'id de l\'évaluation est obligatoire'),
    check('note')
        .not()
        .isEmpty()
        .withMessage('La note est obligatoire')
        .isNumeric()
        .isInt({min: 0, max: 100})
        .withMessage('La note doit être comprise entre 0 et 100'),
]

exports.validationEditResult = [
    check('eval_id')
        .not()
        .isEmpty()
        .withMessage('L\'id est obligatoire'),
]
exports.addResultValidation = (req, res, next) =>{
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
