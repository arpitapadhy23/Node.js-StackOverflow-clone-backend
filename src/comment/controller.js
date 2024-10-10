const { v4: uuidv4 } = require("uuid");
const c = require("../utils/db");

const { successMessage } = require("../utils/successMessage");
const {
  _commentInsertQuery,
  _fetchCommentAuthorQuery,
  _updateCommentQuery,
  _deleteCommentQuery,
} = require("./query");

const { customError } = require("../utils/customErrorClass");

const addComment = async (req, res, next) => {
  try {
    const CID = uuidv4();
    const { TITLE, DESCRIPTION, AID } = req.body.data;
    let startTime = performance.now();
    const UID = req.UID;

    const commentInsertParams = [
      `${CID}`,
      `${TITLE}`,
      `${DESCRIPTION}`,
      `${UID}`,
      `${AID}`,
    ];
    const insertCommentResponse = await c.executeQuery(
      _commentInsertQuery(),
      commentInsertParams
    );

    let endTime = performance.now();
    let totalTime = endTime - startTime;
    let successObj = {
      data: `${insertCommentResponse[0].affectedRows} updated`,
      message: "Data Updated Successfully",
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
      ? f != "CID"
        ? (s += `${f}='${data[f]}',`)
        : null
      : null;
  });
  s = s.slice(0, -1);
  const _finalUpdateQuery = _updateCommentQuery()
    .replace("{s}", s)
    .replace("{CID}", `"${data.CID}"`);

  return _finalUpdateQuery;
};

const updateComment = async (req, res, next) => {
  try {
    const updateBody = req.body.data;
    const UID = req.UID;

    const fetchCommentAuthorId = await c.executeQuery(
      _fetchCommentAuthorQuery(),
      [updateBody.CID]
    );

    if (!(fetchCommentAuthorId[0][0].userId === UID)) {
      throw new customError("Some Error Occured","Access Denied", 401);
    }

    let sTime = performance.now();
    let updateFields = Object.keys(updateBody);
    const _updateQuery = constructUpdateQuery(updateFields, updateBody);

    const updateCommentResponse = await c.executeQuery(_updateQuery);

    let eTime = performance.now();
    let tTime = eTime - sTime;
    let successObj = {
      data: `${updateCommentResponse[0].affectedRows} updated`,
      message: "Update Data Successfully",
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

const deleteComment = async (req, res, next) => {
  try {
    const UID = req.UID;
    const CID = req.params.cid;
    const fetchCommentAuthor = await c.executeQuery(
      _fetchCommentAuthorQuery(),
      [CID]
    );

    if (!(fetchCommentAuthor[0].length > 0)) {
      throw new customError("Some Error Occured","Entry Not found", 403);
    }

    if (!(fetchCommentAuthor[0][0].userId === UID)) {
      throw new customError("Some Error Occured","Access Denied", 401);
    }

    let sTime;
    const deleteCommentRespone = await c.executeQuery(_deleteCommentQuery(), [
      CID,
    ]);

    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: `${deleteCommentRespone[0].affectedRows} deleted`,
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

module.exports = { addComment, updateComment, deleteComment };
