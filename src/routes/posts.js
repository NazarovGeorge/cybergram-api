const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

const {
  getAll,
  getById,
  getFeed,
  create,
  changeById,
  deleteById,
} = require('../controllers/posts');

const { isAuth } = require('../middlewares/authenticate');
const { upload } = require('../middlewares/upload');

const { validatePost } = require('../validators/validatePost');

router.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 3 * 1024 * 1024 },
    parseNested: true,
    safeFileNames: /[^\w!?/.]/g,
  }),
);
router.get('/', isAuth, getAll);
router.get('/:id', isAuth, getById);
router.post('/', isAuth, upload, validatePost, create);
router.put('/:id', isAuth, validatePost, changeById);
router.delete('/:id', isAuth, deleteById);

module.exports = router;
