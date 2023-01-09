const Card = require('../models/card');
const { InternalServerError } = require('../errors/internalServerError');
const { NotExistError } = require('../errors/notExistError');
const { ValidationError } = require('../errors/validationError');

const notExistCardsError = new NotExistError('Карточки не найдены');
const notExistCardError = new NotExistError('Карточка с указанным _id не найдена');
const validationCardError = new ValidationError('Переданы некорректные данные при создании карточки');
const internalServerError = new InternalServerError();

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      if (cards.length === 0) {
        res.status(notExistCardsError.statusCode).send({ message: notExistCardsError.message });
        return;
      }
      res.send(cards);
    })
    .catch((err) => {
      res.status(internalServerError.statusCode).send({ message: err.message });
    });
};

const createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationCardError.statusCode).send({ message: validationCardError.message });
        return;
      }
      res.status(internalServerError.statusCode).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (card === null) {
        res.status(notExistCardError.statusCode).send({ message: notExistCardError.message });
        return;
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      res.status(internalServerError.statusCode).send({ message: err.message });
    });
};

const addLikesCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card === null) {
        res.status(notExistCardError.statusCode).send({ message: notExistCardError.message });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notExistCardError.statusCode).send({ message: notExistCardError.message });
        return;
      }
      res.status(internalServerError.statusCode).send({ message: err.message });
    });
};

const removeLikesCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card === null) {
        res.status(notExistCardError.statusCode).send({ message: notExistCardError.message });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notExistCardError.statusCode).send({ message: notExistCardError.message });
        return;
      }
      res.status(internalServerError.statusCode).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikesCard,
  removeLikesCard,
};
