const { v4: uuidv4 } = require("uuid");

const c = require("../utils/db");

const { successMessage } = require("../utils/successMessage");
const { customError } = require("../utils/customErrorClass");

const {
  _updateAnswerQuery,
  _checkAuthorOfQuestionQuery,
  _insertAnswerQuery,
  _fetchAnswerAuthorQuery,
  _deleteAnswerQuery,
} = require("./query");

const addAnswer = async (req, res, next) => {
  try {
    const UID = req.UID;
    const AID = uuidv4();
    const { DESCRIPTION } = req.body.data;
    const QID = req.params.id;

    const answerAuthor = await c.executeQuery(_checkAuthorOfQuestionQuery(), [
      QID,
    ]);
    if (answerAuthor[0][0].userId === UID) {
      throw new customError("Some Error Occured","Access Denied", 401);
    }

    let startTime = performance.now();
    const insertQueryParams = [`${QID}`, `${AID}`, `${DESCRIPTION}`, `${UID}`];

    const insertAnswerQueryResponse = await c.executeQuery(
      _insertAnswerQuery(),
      [insertQueryParams]
    );

    let endTime = performance.now();
    let totalTime = endTime - startTime;

    let successObj = {
      data: `${insertAnswerQueryResponse[0].affectedRows} inserted`,
      message: "Data Inserted Successfully",
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

const constructUpdateQuery = (fields, data) => {
  let s = "";
  fields.map((f) => {
    String(data[f]).length > 0
      ? f != "AID"
        ? (s += `${f}='${data[f]}',`)
        : null
      : null;
  });
  s = s.slice(0, -1);
  const _finalUpdateQuery = _updateAnswerQuery()
    .replace("{s}", s)
    .replace("{AID}", `"${data.AID}"`);

  return _finalUpdateQuery;
};

const updateAnswer = async (req, res, next) => {
  try {
    const updateBody = req.body.data;
    const UID = req.UID;

    const fetchAnswerAuthorId = await c.executeQuery(
      _fetchAnswerAuthorQuery(),
      [updateBody.AID]
    );

    if (!(fetchAnswerAuthorId[0][0].userId === UID)) {
      throw new customError("Some Error Occured","Access Denied", 403);
    }

    let sTime = performance.now();
    let updateFields = Object.keys(req.body.data);
    const _updateAnswerQuery = constructUpdateQuery(updateFields, updateBody);
    const updateAnswerResponse = await c.executeQuery(_updateAnswerQuery);
    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: {
        data: `${updateAnswerResponse[0].affectedRows} updated`,
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

const deleteAnswer = async (req, res, next) => {
  try {
    const UID = req.UID;
    const AID = req.params.aid;
    const fetchAnswerAuthor = await c.executeQuery(_fetchAnswerAuthorQuery(), [
      AID,
    ]);

    if (!(fetchAnswerAuthor[0].length > 0)) {
      throw new customError("Some Error Occured","Entry Not found", 403);
    }

    if (!(fetchAnswerAuthor[0][0].userId === UID)) {
      throw new customError("Some Error Occured","Access Denied", 401);
    }

    let sTime;
    const deleteAnswerResponse = await c.executeQuery(_deleteAnswerQuery(), [
      AID,
    ]);

    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: `${deleteAnswerResponse[0].affectedRows} deleted`,
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

module.exports = { addAnswer, updateAnswer, deleteAnswer };
