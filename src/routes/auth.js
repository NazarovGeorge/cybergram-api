const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  recieveAuth,
  logout,
  logoutAll,
} = require('../controllers/auth');

const { isAuth } = require('../middlewares/authenticate');

const { validateSignup } = require('../validators/validateSignup');

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.post('/recieveAuth', isAuth, recieveAuth);
router.post('/logout', isAuth, logout);
router.post('/logoutAll', isAuth, logoutAll);

module.exports = router;
