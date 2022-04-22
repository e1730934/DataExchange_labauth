const {check, validationResult } = require('express-validator');
exports.validateUserSignUp = [
    check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is Empty')
    .isLength({min:3, max: 20})
    .withMessage('Name must be within 3 to 20 character!'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email!'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is Empty')
    .isLength({min: 8, max:20})
    .withMessage('Password must be within 8 to 20 character!'),
];


exports.userValidation = (req, res, next) => {

    const result = validationResult(req).array()
    console.log(result);
     if(!result.length) return next();
     const error = result[0].msg;
     res.json({success: false, message:error})
};

