const jwt = require("jsonwebtoken");
const { customError } = require("./customErrorClass");

const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new customError("Some Error Occured","Invalid Credentials", HT);
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new customError("Some Error Occured","Invalid Credentials", 403);
      }
      req.UID = decoded.UID;
      req.UID_2 = decoded.UID;
      next();
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = { validateToken };
