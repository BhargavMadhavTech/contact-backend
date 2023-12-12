const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let jwtToken;
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (authorization && authorization.startsWith("Bearer")) {
    jwtToken = authorization.split(" ")[1];
    jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECERT, (error, decoded) => {
      if (error) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });
    if (!jwtToken) {
      res.status(401);
      throw new Error("User is not authorized or token is missing!");
    }
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing!");
  }
});

module.exports = validateToken;
