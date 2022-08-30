const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const urlRegExp = require('../utils/constatns');
const NotFoundError = require('../utils/not-found-error');

router.use(requestLogger);
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use(errorLogger);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
