const router = require('express').Router();
const {
  getUsers, getUser, editUserInfo, editUserAvatar, getMeInfo,
} = require('../controllers/users');

router.patch('/me/avatar', editUserAvatar);
router.get('/me', getMeInfo);
router.patch('/me', editUserInfo);
router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
