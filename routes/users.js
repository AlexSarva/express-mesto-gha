const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, editUserInfo, editUserAvatar, getMeInfo,
} = require('../controllers/users');
const { UrlCheckRegex } = require('../constants/validate');

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(UrlCheckRegex),
  }),
}), editUserAvatar);
router.get('/me', getMeInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserInfo);
router.get('/', getUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), getUser);

module.exports = router;
