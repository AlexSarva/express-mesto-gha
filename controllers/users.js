const User = require('../models/user');
const { InternalServerError } = require('../errors/internalServerError');
const { NotExistError } = require('../errors/notExistError');
const { ValidationError } = require('../errors/validationError');

const notExistUsersError = new NotExistError('Пользователи не найдены');
const notExistUserError = new NotExistError('Пользователь по указанному _id не найден.');
const validationCreateUserError = new ValidationError('Переданы некорректные данные при создании пользователя.');
const validationEditUserError = new ValidationError('Переданы некорректные данные при обновлении профиля.');
const internalServerError = new InternalServerError('');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(notExistUsersError.statusCode).send({ message: notExistUsersError.message });
        return;
      }
      res.send(users);
    })
    .catch((err) => {
      res.status(internalServerError.status).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(notExistUserError.statusCode).send({ message: notExistUserError.message });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notExistUserError.statusCode).send({ message: notExistUserError.message });
        return;
      }
      res.status(internalServerError.statusCode).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationCreateUserError.statusCode)
          .send({ message: validationCreateUserError.message });
        return;
      }
      res.status(internalServerError.status).send({ message: err.message });
    });
};

const editUserInfo = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(notExistUserError.statusCode).send({ message: notExistUserError.message });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationEditUserError.statusCode)
          .send({ message: validationEditUserError.message });
        return;
      }
      res.status(internalServerError.status).send({ message: err.message });
    });
};

const editUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(notExistUserError.statusCode).send({ message: notExistUserError.message });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationEditUserError.statusCode)
          .send({ message: validationEditUserError.message });
        return;
      }
      res.status(internalServerError.status).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUserInfo,
  editUserAvatar,
};
