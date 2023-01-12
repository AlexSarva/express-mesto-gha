require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { InternalServerError } = require('./errors/internalServerError');
const { NotFoundError } = require('./errors/notFoundError');

const { PORT } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/auth'));

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());
app.use((err, req, res, next) => {
  const {
    statusCode, message,
  } = err;

  const internalServerError = new InternalServerError('На сервере произошла ошибка');

  res.status(!statusCode ? 500 : statusCode).send({
    message: statusCode !== 500
      ? message
      : internalServerError.message,
  });

  next();
});
app.listen(PORT, () => {

});
