const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error();
    } else {
      req.currentToken = token;
      req.currentUser = user;
      next();
    }
  } catch (error) {
    return res.status(401).json({
      auth: 'Error',
    });
  }
};
