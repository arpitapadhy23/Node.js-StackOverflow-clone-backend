const _insertUserQuery = () => {
  return `
      INSERT 
      INTO 
        USERS 
      VALUES 
        (?)`;
};

let _deleteUserQuery = () => {
  return `
    UPDATE 
      USERS 
    SET 
      IS_ACTIVE = ? 
    WHERE 
      UID = ?`;
};

const _checkUserQuery = () => {
  return `
    SELECT 
      EXISTS 
        (
          SELECT 
            1 
          FROM 
            USERS 
          WHERE 
            UID = ? 
        ) 
      AS 
        checkUser`;
};

const _updateUserQuery = () => {
  return `  
    UPDATE 
      USERS 
    SET 
      {s}
    WHERE 
      UID={UID};`;
};

const _fetchUserIdQuery = () => {
  return `
    SELECT 
      UID 
    FROM 
      USERS 
    WHERE 
      UID= ?
  `;
};

const _searchQuery = () => {
  return `
    SELECT 
        A.DESCRIPTION AS answerDesc,
        C.TITLE AS commentTitle,
        C.DESCRIPTION AS commentDesc,
        Q.TITLE AS questionAsked,
        Q.DESCRIPTION AS questionDesc
    FROM
        ANSWER A
            CROSS JOIN
        QUESTION Q ON A.QID = Q.QID
            CROSS JOIN
        COMMENTS C ON A.AID = C.ANSWER_ID
    HAVING answerDesc LIKE ?
        OR commentDesc LIKE ?
        OR questionDesc LIKE ?;
    `;
};

module.exports = {
  _insertUserQuery,
  _deleteUserQuery,
  _checkUserQuery,
  _updateUserQuery,
  _fetchUserIdQuery,
  _searchQuery,
};
