const { customError } = require("./customErrorClass");
const joi = require("joi");

const userSchema = joi.object({
  NAME: joi.string().max(20).required(),
  USERNAME: joi.string().max(20).required(),
  PASSWORD: joi.string().max(20).required(),
});

const answerSchema = joi.object({
  DESCRIPTION: joi.string().required(),
  QID: joi.string().max(36).required(),
});

const commentSchema = joi.object({
  AID: joi.string().max(36).required(),
  TITLE: joi.string().required(),
  DESCRIPTION: joi.string().required(),
});

const loginUserSchema = joi.object({
  UID: joi.string().max(36).required(),
  USERNAME: joi.string().max(20).required(),
  PASSWORD: joi.string().max(20).required(),
});

const questionSchema = joi.object({
  TITLE: joi.string().max(36).required(),
  DESCRIPTION: joi.string().required(),
});

const isValidate = (data, schema, next) => {
  try {
    const { value, error } = schema.validate(data);
    if (error) {
      throw new customError("Some Error Occured", "Validation Failed", 401);
    }
    return true;
  } catch (error) {
    next(error);
  }
};

const validateUser = (req, res, next) => {
  const user = req.body.data;
  const isUserValidate = isValidate(user, userSchema, next);
  if (isUserValidate) {
    next();
  }
};

const validateLoginUser = (req, res, next) => {
  const user = req.body.data;
  const isUserValidate = isValidate(user, loginUserSchema, next);
  if (isUserValidate) {
    next();
  }
};

const validateComment = (req, res, next) => {
  const comment = req.body.data;
  const isCommentValidate = isValidate(comment, commentSchema, next);
  if (isCommentValidate) {
    next();
  }
};

const validateQuestion = (req, res, next) => {
  const question = req.body.data;
  const isQuestionValidate = isValidate(question, questionSchema, next);
  if (isQuestionValidate) {
    next();
  }
};

const validateAnswer = (req, res, next) => {
  const answer = req.body.data;
  const isAnswerValidate = isValidate(answer, answerSchema, next);
  if (isAnswerValidate) {
    next();
  }
};

module.exports = {
  validateUser,
  validateComment,
  validateQuestion,
  validateAnswer,
  validateLoginUser,
};
