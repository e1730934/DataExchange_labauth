const {check, validationResult} = require('express-validator');

exports.validationAddEvaluation = [
    //- Le champ (nom évaluation) ne peut pas être vide et ne peut pas contenir moins de 5 caractères.
    check('name')
        .not()
        .isEmpty()
        .withMessage('Le champ nom évaluation ne peut pas être vide.')
        .isLength({min: 5})
        .withMessage('Le champ nom évaluation ne peut pas contenir moins de 5 caractères.')
];

exports.validationEditEvaluation = [
    check('id')
        .not()
        .isEmpty()
        .withMessage('L\'id est obligatoire'),
]

exports.addEvalValidation = (req, res, next) =>{
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
