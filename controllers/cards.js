const Card = require('../models/card');
const { NotExistError } = require('../errors/notExistError');
const { PermissionError } = require('../errors/permissionError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      if (card === null) {
        throw new NotExistError('Карточка с указанным _id не найдена');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new PermissionError('Нет прав для удаления этой карточки');
      }

      return card;
    })
    .then((card) => Card.findByIdAndRemove(card._id)
      .then(() => {
        res.status(200).send({ message: 'Карточка успешно удалена' });
      })
      .catch(next))
    .catch(next);
};

const addLikesCard = (req, res, next) => {
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
        throw new NotExistError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};

const removeLikesCard = (req, res, next) => {
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
        throw new NotExistError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikesCard,
  removeLikesCard,
};
