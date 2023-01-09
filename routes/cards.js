const router = require('express').Router();
const {
  getCards, createCard, deleteCard, addLikesCard, removeLikesCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:id', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', addLikesCard);
router.delete('/:cardId/likes', removeLikesCard);

module.exports = router;
