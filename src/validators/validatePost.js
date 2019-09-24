const { body, validationResult } = require('express-validator');

exports.validatePost = [
  body('caption')
    .optional()
    .trim()
    .isLength({
      min: 1,
      max: 1500,
    })
    .withMessage('Напишите подпись к посту,используя от 1 до 1500 символов'),
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
      ...result,
    });
  },
];
