const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("./controllers");

const { validateToken } = require("../utils/authValidation");
const validation = require("../utils/validation");

router.post("/register", [validation.validateUser], createUser);
router.post("/login", [validation.validateLoginUser], loginUser);
router.put("/update", validateToken, updateUser);
router.put("/delete", validateToken, deleteUser);

module.exports = router;
