const mysql = require("mysql2");
const Redis = require("ioredis");
const { v4: uuidv4 } = require("uuid");

const c = require("../utils/db");
const { successMessage } = require("../utils/successMessage");
const {
  _updateQuestionQuery,
  _fetchQuestionAuthorIdQuery,
  _deleteQuestionQuery,
  _selectAnswerQuestionByIdQuery,
  _insertQuestionQuery,
  _selectCommentOfAnswerQuery,
} = require("../question/query");
const { customError } = require("../utils/customErrorClass");

const deleteQuestion = async (req, res, next) => {
  try {
    const UID = req.UID;
    const { QID } = req.body.data;

    const fetchQuestionAuthor = await c.executeQuery(
      _fetchQuestionAuthorIdQuery(),
      [QID]
    );

    if (!(fetchQuestionAuthor[0][0].UID === UID)) {
      throw new customError("Some Error Occured","Access Denied", 401);
    }
    let sTime;
    const deleteQuestionRespone = await c.executeQuery(_deleteQuestionQuery, [
      QID,
    ]);

    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: `${deleteQuestionRespone[0].affectedRows} deleted`,
      message: "Row Deleted Successfully",
      startTime: sTime,
      endTime: eTime,
      totalTime: tTime,
    };

    let successResponse = successMessage(200, successObj);
    res.status(200).send(successResponse);
  } catch (error) {
    return next(error);
  }
};

const getAllQuestion = async (req, res, next) => {
  try {
    let successObj;
    const startTime = performance.now();
    const cachedQuestions = await redisClient.get("questions");
    const endTime = performance.now();

    if (cachedQuestions) {
      const parsedQuestion = JSON.parse(cachedQuestions);
      const totalTime = endTime - startTime;

      successObj = {
        data: parsedQuestion,
        message: "Data Fetched Successfully",
        startTime: startTime,
        endTime: endTime,
        totalTime: totalTime,
      };
    } else {
      const sTime = performance.now();
      const questions = await c.executeQuery(_selectAllQuestionQuery());
      await redisClient.set(
        "questions",
        JSON.stringify(dataObtained[0]),
        "EX",
        60
      );

      let eTime = performance.now();
      let tTime = eTime - sTime;

      successObj = {
        data: questions[0],
        message: "Data Fetched Successfully",
        startTime: sTime,
        endTime: eTime,
        totalTime: tTime,
      };
    }
    const successResponse = successMessage(200, successObj);
    res.status(200).send(successResponse);
  } catch (error) {
    return next(error);
  }
};

const constructQuestionDiscussion = async (dataObtained) => {
  let result = {};

  result["questiontitle"] = dataObtained[0].questionTitle;
  result["questionDescription"] = dataObtained[0].questionDesc;
  result["questionAuthor"] = dataObtained[0].questionAuthorName;
  result["answers"] = [];

  dataObtained.map((key) => {
    console.log(key);
    let answerObj = {};
    answerObj["answerId"] = key.answerId;
    answerObj["answer"] = key.answerDesc;
    answerObj["answerAuthor"] = key.answerAuthor;
    result.answers.push(answerObj);
  });

  const comments = await c.executeQuery(_selectCommentOfAnswerQuery());
  result.answers.map((key) => {
    const commentOfAnswer = comments[0].filter((k) => {
      return k.answerId == key["answerId"];
    });

    if (commentOfAnswer.length > 0) {
      key["comments"] = [];
      commentOfAnswer.map((k) => {
        let commentObj = {};
        commentObj["commentTitle"] = k.commentTitle;
        commentObj["commentDescription"] = k.commentDescription;
        commentObj["commentAuthor"] = k.commentAuthor;
        key.comments.push(commentObj);
      });
    }
  });

  return result;
};

const redisClient = new Redis();

const getQuestionById = async (req, res, next) => {
  try {
    let startTime = performance.now();
    const QID = req.params.id;

    let answersOfQuestion = await c.executeQuery(
      _selectAnswerQuestionByIdQuery(),
      [QID]
    );

    const questionDiscussion = await constructQuestionDiscussion(
      answersOfQuestion[0]
    );
    let endTime = performance.now();
    let totalTime = endTime - startTime;

    let successObj = {
      data: questionDiscussion,
      message: "Data Fetched Successfully",
      startTime: startTime,
      endTime: endTime,
      totalTime: totalTime,
    };

    let successResponse = successMessage(200, successObj);
    res.status(200).send(successResponse);
  } catch (error) {
    return next(error);
  }
};

const addQuestion = async (req, res, next) => {
  try {
    let startTime = performance.now();
    const UID = req.UID;
    const QID = uuidv4();
    const { TITLE, DESCRIPTION } = req.body.data;
    const insertQuestionParams = [
      `${QID}`,
      `${TITLE}`,
      `${DESCRIPTION}`,
      `${UID}`,
    ];
    const insertQuestionResponse = await c.executeQuery(
      _insertQuestionQuery(),
      [insertQuestionParams]
    );

    let endTime = performance.now();
    let totalTime = endTime - startTime;
    let successObj = {
      data: `${insertQuestionResponse[0].affectedRows} inserted`,
      message: "Data Inserted Successfully",
      startTime: startTime,
      endTime: endTime,
      totalTime: totalTime,
    };

    let successResponse = successMessage(200, successObj);
    res.status(200).send(successResponse);
  } catch (error) {
    const errorCode = error.errorCode ? error.errorCode : 500;
    const e = new customError("Some Error Occured", error.message, errorCode);
    return next(error);
  }
};

const constructUpdateQuery = (fields, data) => {
  let s = "";
  fields.map((f) => {
    String(req.body.data[f]).length > 0
      ? f != "QID"
        ? (s += `${f}='${req.body.data[f]}',`)
        : null
      : null;
  });
  s = s.slice(0, -1);

  const _finalUpdateQuery = _updateQuestionQuery()
    .replace("${s}", s)
    .replace("${ID}", `"${data.QID}"`);

  return _finalUpdateQuery;
};

const updateQuestion = async (req, res, next) => {
  try {
    const updateBody = req.body.data;
    const UID = req.UID;
    const fetchQuestionAuthorId = mysql.format(_fetchQuestionAuthorIdQuery(), [
      updateBody.QID,
    ]);

    if (!(fetchQuestionAuthorId[0][0].userId === UID)) {
      throw new customError("Some Error Occured","Access Denied", 401);
    }
    let sTime = performance.now();

    let updateFields = Object.keys(req.body.data);
    const _updateQuery = constructUpdateQuery(updateFields, updateBody);

    const updateCommentResponse = await c.executeQuery(_updateQuery);
    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: {
        data: `${updateCommentResponse[0].affectedRows} updated`,
        message: "Update Data Successfully",
        startTime: sTime,
        endTime: eTime,
        totalTime: tTime,
      },
    };

    let successResponse = successMessage(200, successObj);
    res.status(200).send(successResponse);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  deleteQuestion,
  getAllQuestion,
  getQuestionById,
  addQuestion,
  updateQuestion,
};
