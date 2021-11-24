const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const CustomError = require("../utils/CustomError");

module.exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    const error = new CustomError("Not authorized to access this route", 401);
    next(error);
  } else {
    try {
      jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        async (error, decodedToken) => {
          if (error) {
            next(error);
          } else {
            const user = await userModel.findById(decodedToken.id);
            if (!user) {
              next(new CustomError("No user found with this token", 404));
            } else {
              req.user = user;
              next();
            }
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
};
