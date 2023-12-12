const asyncHandler = require("express-async-handler");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

/**
 * @description Register user
 * @routes POST api/users
 * @access public
 */
const register = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("userName, email and password all field are mandatory!");
  }
  const isUserAvailable = await userModel.findOne({ email });
  if (isUserAvailable) {
    res.status(400);
    throw new Error("user already registered");
  }

  const hashPassword = await bycrypt.hash(password, 10);
  console.log(
    "🚀 ~ file: userController.js:28 ~ register ~ hashPassword:",
    hashPassword
  );
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  if (createUser) {
    res.status(200).json({
      _id: createUser.id,
      userName: createUser.userName,
      email: createUser.email,
    });
  } else {
    res.status(400);
    throw new Error("User Details is not valid");
  }
});

/**
 * @description login user
 * @routes POST api/users
 * @access public
 */

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are mandatory!");
  }
  const user = await userModel.findOne({ email });
  const passwordCompare = await bycrypt.compare(password, user.password);
  if (user && passwordCompare) {
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      {
        expiresIn: "15m",
      }
    );
    res.status(200).json({ accessToken, refereshToken: "" });
  } else if (user && !passwordCompare) {
    res.status(401);
    throw new Error("Password is wrong!");
  } else {
    res.status(401);
    throw new Error("User not found please register before login!");
  }
});

/**
 * @description get user details
 * @routes GET api/users
 * @access private
 */
const getUserDetails = asyncHandler(async (req, res) => {
  const userDetails = userModel.findById(req.user.id);
  res.json(req.user);
});

module.exports = { register, login, getUserDetails };
