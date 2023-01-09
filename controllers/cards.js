const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link, ownerId } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => res.send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then(() => res.send({ message: 'success' }))
    .catch((err) => res.send({ message: err.message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
