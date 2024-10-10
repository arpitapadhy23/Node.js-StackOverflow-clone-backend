const _checkAuthorOfQuestionQuery = () => {
  return `
    SELECT 
        USER_ID as userId
    FROM
        ANSWER
    WHERE
        QID = ?;
    `;
};

const _insertAnswerQuery = () => {
  return `
    INSERT 
    INTO 
      ANSWER
    ( 
      QID,
      AID,
      DESCRIPTION,
      USER_ID
    )
      VALUES (?)`;
};

const _updateAnswerQuery = () => {
  return `
    UPDATE 
      ANSWER 
    SET
      {s} 
    WHERE   
      AID = {AID}`;
};
const _fetchAnswerAuthorQuery = () => {
  return `
    SELECT 
      USER_ID as userId
    FROM 
      ANSWER 
    WHERE 
      AID = ?
    `;
};

const _deleteAnswerQuery = () => {
  return `
  DELETE 
  FROM 
    ANSWER 
  WHERE 
    AID=?`;
};

module.exports = {
  _checkAuthorOfQuestionQuery,
  _insertAnswerQuery,
  _fetchAnswerAuthorQuery,
  _updateAnswerQuery,
  _deleteAnswerQuery,
};
