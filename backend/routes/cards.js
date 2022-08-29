const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const urlRegExp = require('../utils/constatns');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(urlRegExp),
    }),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24),
    }),
  }),
  deleteCard,
);

router.put(
  '/likes/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24),
    }),
  }),
  likeCard,
);

router.delete(
  '/likes/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
