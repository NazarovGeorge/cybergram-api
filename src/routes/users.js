const express = require('express');
const router = express.Router();

const {
  getBySearch,
  getByUsername,
  follow,
  unfollow,
} = require('../controllers/users');

const { isAuth } = require('../middlewares/authenticate');

router.get('/', isAuth, getBySearch);
router.get('/:username', isAuth, getByUsername);
router.put('/follow', isAuth, follow);
router.put('/unfollow', isAuth, unfollow);

module.exports = router;
