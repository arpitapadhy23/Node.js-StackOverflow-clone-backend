const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const c = require("../utils/db");
const { successMessage } = require("../utils/successMessage");
const { customError } = require("../utils/customErrorClass");

const {
  _insertUserQuery,
  _deleteUserQuery,
  _updateUserQuery,
  _searchQuery,
  _checkUserQuery,
  _fetchUserIdQuery,
} = require("./query");

const jwtKey = process.env.JWT_SECRET;

const createUser = async (req, res, next) => {
  try {
    const UID = uuidv4();
    const { NAME, USERNAME, PASSWORD, IS_ACTIVE } = req.body.user;

    const insertParams = [
      [`${UID}`, `${NAME}`, `${USERNAME}`, `${PASSWORD}`, `${IS_ACTIVE}`],
    ];

    const sTime = performance.now();
    const response = await c.executeQuery(_insertUserQuery(), insertParams);
    const eTime = performance.now();

    const result = response[0].affectedRows;
    const tTime = eTime - sTime;

    let successObj = {
      data: `${result} inserted`,
      message: "Data Inserted Successfully",
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

const deleteUser = async (req, res, next) => {
  try {
    let sTime = performance.now();
    const { UID } = req.body.data;
    const deleteUserResponse = await c.executeQuery(_deleteUserQuery(), [
      0,
      UID,
    ]);
    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: `${deleteUserResponse[0].affectedRows} deleted`,
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

const generateToken = (data) => {
  const token = jwt.sign(data, jwtKey, {
    expiresIn: "1h",
  });
  return token;
};

const checkUserExist = async (userId) => {
  const checkUserQueryResponse = await c.executeQuery(_checkUserQuery(), [
    userId,
  ]);
  const checkUserResult = checkUserQueryResponse[0][0]["checkUser"] === 1;
  return checkUserResult;
};

const loginUser = async (req, res, next) => {
  try {
    const { UID, USERNAME, PASSWORD } = req.body.data;
    const isCheckUserExist = await checkUserExist(UID);

    if (!isCheckUserExist) {
      throw new customError("Some Error Occured", "User Not Found", 404);
    }

    const tokenPayload = { UID: UID, USERNAME: USERNAME, PASSWORD: PASSWORD };

    const sTime = performance.now();
    const token = generateToken(tokenPayload);
    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      token: token,
      message: "Token Generated Successfully",
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

const constructUpdateQuery = (fields, data) => {
  let s = "";
  fields.map((f) => {
    String(data[f]).length > 0
      ? f != "UID"
        ? (s += `${f}='${data[f]}',`)
        : null
      : null;
  });
  s = s.slice(0, -1);

  const _finalUpdateQuery = _updateUserQuery()
    .replace("{s}", s)
    .replace("{UID}", `"${data.UID}"`);
  return _finalUpdateQuery;
};

const checkAuthor = async (userId, decodedUserId) => {
  const response = await c.executeQuery(_fetchUserIdQuery(), [userId]);
  return response[0][0].UID === decodedUserId;
};

const updateUser = async (req, res, next) => {
  try {
    const { UID } = req.body.data;
    const reqUpdateBody = req.body.data;
    const UID_D = req.UID_2;

    const isAuthorCheck = checkAuthor(UID, UID_D);

    if (!isAuthorCheck) {
      throw customError("Some Error Occured","Access Denied", 401);
    }

    let sTime = performance.now();
    let fieldsToUpdate = Object.keys(req.body.data);
    const _updateQuery = constructUpdateQuery(fieldsToUpdate, reqUpdateBody);
    console.log(_updateQuery);
    const updateUserQueryResponse = await c.executeQuery(_updateQuery);

    let eTime = performance.now();
    let tTime = eTime - sTime;

    let successObj = {
      data: `${updateUserQueryResponse[0].affectedRows} updated`,
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

const search = async (req, res, next) => {
  try {
    let sTime = performance.now();
    const questionQuery = "%" + req.query.q + "%";
    const answerQuery = "%" + req.query.a + "%";
    const commentQuery = "%" + req.query.c + "%";

    const searchParams = [answerQuery, commentQuery, questionQuery];

    let dataObtained = await c.executeQuery(_searchQuery(), searchParams);

    let eTime = performance.now();
    let tTime = eTime - sTime;

    const successObj = {
      message: "Data Fetched Successfully",
      data: dataObtained[0],
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

module.exports = {
  createUser,
  deleteUser,
  loginUser,
  updateUser,
  search,
};
