const { body, validationResult } = require('express-validator');

exports.validateSignup = [
  body('username')
    .trim()
    .isLength({
      min: 3,
      max: 30,
    })
    .withMessage('Введите имя, используя от 3 до 30 символов')
    .isAlphanumeric()
    .withMessage('Можно использовать латиницу (a-z, A-Z) и цифры (0,9)'),
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email обязателен')
    .isEmail()
    .withMessage('Невалидный email'),
  body('password')
    .trim()
    .isLength({
      min: 3,
      max: 16,
    })
    .withMessage('Введите пароль, используя от 3 до 16 символов'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const result = errors.mapped();
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        result[key] = result[key].msg;
      }
    }
    res.status(400).json({
      signup: result,
    });
  },
];
