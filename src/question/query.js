const _deleteQuestionQuery = () => {
  return `
  DELETE 
  FROM 
    QUESTION 
  WHERE 
    QID=?`;
};

const _insertQuestionQuery = () => {
  return `
    INSERT 
    INTO 
      QUESTION 
        (
          QID,
          TITLE,
          DESCRIPTION,
          UID
        )
    VALUES (?)`;
};

const _selectAllQuestionQuery = () => {
  return `
    SELECT 
      QID,
      TITLE,
      DESCRIPTION,
      UID
    FROM 
      QUESTION
      `;
};

const _selectAnswerQuestionByIdQuery = () => {
  return `
    SELECT 
      A.AID as answerId, 
      A.DESCRIPTION as answerDesc, 
      (
        SELECT 
          NAME 
        FROM 
          USERS 
        WHERE 
          UID = A.USER_ID
      )   
      AS 
        answerAuthor, 
      Q.TITLE as questionTitle, 
      Q.QID as questionId,
      Q.DESCRIPTION as questionDesc 
      FROM 
        ANSWER A 
      JOIN 
        QUESTION Q 
      ON 
        A.QID = Q.QID 
      WHERE 
        Q.QID= ?`;
};

const _selectCommentOfAnswerQuery = () => {
  return `
    SELECT 
      A.AID as answerId,
      (
        SELECT 
          NAME
        FROM
          USERS
        WHERE
          UID = C.USER_ID
      ) 
      AS commentAuthor,
      A.DESCRIPTION as answerDesc,
      A.QID as answerToQuestion,
      C.CID as commentId,
      C.TITLE as commentTitle,
      C.DESCRIPTION as commentDescription
    FROM 
      ANSWER A 
    JOIN 
      COMMENTS C 
    ON 
      A.AID = C.ANSWER_ID`;
};

const _updateQuestionQuery = () => {
  return `
  UPDATE 
    QUESTION 
  SET ? 
    WHERE 
  QID= {QID}`;
};
const _fetchQuestionAuthorIdQuery = () => {
  return `
    SELECT 
    UID 
    FROM 
    QUESTION 
    WHERE 
    QID= ?
    `;
};

const _fetchQuestionAuthorQuery = () => {
  return `
  SELECT 
    UID as userId
  FROM 
    QUESTION 
  WHERE 
    QID= ?
  `;
};

module.exports = {
  _deleteQuestionQuery,
  _insertQuestionQuery,
  _selectAllQuestionQuery,
  _selectAnswerQuestionByIdQuery,
  _selectCommentOfAnswerQuery,
  _fetchQuestionAuthorIdQuery,
  _updateQuestionQuery,
  _fetchQuestionAuthorQuery,
};
