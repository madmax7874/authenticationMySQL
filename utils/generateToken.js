const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWTKEY, {
    expiresIn: '1d',
  });
};

module.exports = generateToken;