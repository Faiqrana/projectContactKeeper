const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //find the token
  const token = req.header("x-auth-token");

  //check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization denied" });
  }
  //verify the token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is Invalid" });
  }
};
