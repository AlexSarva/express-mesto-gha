const jwt = require('jsonwebtoken');

// const { JWT_SECRET } = process.env;
const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (tkn) => tkn.replace('Bearer ', '');

const auth = (req, res, next) => {
  let { authorization } = req.headers;
  if (!authorization) {
    authorization = req.cookies.jwt;
  }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, '10691b9aa32227c7ed58e3585b55842d9fa02a970bcb84ff7b82dbd44da0467b');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};

module.exports = auth;
