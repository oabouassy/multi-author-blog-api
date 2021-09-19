const jwt = require("jsonwebtoken");

exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

exports.checkToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
