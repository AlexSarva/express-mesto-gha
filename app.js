require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { ValidationError } = require('./errors/validationError');
const { ConflictError } = require('./errors/conflictError');
const { InternalServerError } = require('./errors/internalServerError');

const { PORT } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/auth'));

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.patch('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.use(errors());
app.use((err, req, res, next) => {
  const {
    statusCode, message, name, code,
  } = err;

  console.log(err.statusCode);

  if (name === 'ValidationError') {
    const validationError = new ValidationError('Переданы некорректные данные.');
    res.status(validationError.statusCode).send({ message: validationError.message });
    return;
  }

  if (name === 'CastError') {
    const validationError = new ValidationError('Переданы некорректные данные.');
    res.status(validationError.statusCode).send({ message: validationError.message });
    return;
  }
  if (code === 11000) {
    const conflictError = new ConflictError('Пользователь с таким email уже существует');
    res.status(conflictError.statusCode).send({ message: conflictError.message });
    return;
  }

  const internalServerError = new InternalServerError('На сервере произошла ошибка');

  res.status(statusCode ? statusCode : 500).send({
    message: statusCode === 500
      ? internalServerError.message
      : message,
  });

  next();
});
app.listen(PORT, () => {

});
