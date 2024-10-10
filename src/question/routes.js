const express = require("express");
const router = express.Router();

const { validateToken } = require("../utils/authValidation");
const {
  addComment,
  updateComment,
  deleteComment,
} = require("../comment/controller");

const {
  addAnswer,
  updateAnswer,
  deleteAnswer,
} = require("../answer/controllers");
const validation = require("../utils/validation");

const {
  getAllQuestion,
  getQuestionById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = require("./controllers");

router.get("/", getAllQuestion);
router.get("/:id", getQuestionById);
router.post("/add", [validation.validateQuestion, validateToken], addQuestion);
router.delete("/delete", validateToken, deleteQuestion);
router.put("/update", validateToken, updateQuestion);
router.post(
  "/:id/answer",
  [validation.validateAnswer, validateToken],
  addAnswer
);
router.put("/:id/answer/update", validateToken, updateAnswer);
router.delete("/answer/:aid/delete", validateToken, deleteAnswer);
router.put("/answer/comment/update", validateToken, updateComment);
router.delete("/answer/:aid/comment/:cid/delete", validateToken, deleteComment);

router.post(
  "/answer/comment/add",
  [validation.validateComment, validateToken],
  addComment
);

module.exports = router;
