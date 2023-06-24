const jwt = require("jsonwebtoken");
// const { database } = require("../database.js");
const { database } = require("../endpoint-resolver.js");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.params.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  const hasSession = await database.getSession(token);

  if (!hasSession) {
    return res.status(403).send("token is no longer valid");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    await database.removeSession(token);
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
