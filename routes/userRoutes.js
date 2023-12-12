const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");

const {
  register,
  login,
  getUserDetails,
} = require("../controllers/userController");
const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/user_details", validateToken, getUserDetails);

module.exports = routes;
