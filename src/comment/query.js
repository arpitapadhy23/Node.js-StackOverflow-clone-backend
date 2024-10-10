const _commentInsertQuery = () => {
  return `
  INSERT 
  INTO 
    COMMENTS
    (
      CID,
      TITLE,
      DESCRIPTION,
      USER_ID,
      ANSWER_ID
    )
  VALUES (?)
`;
};

const _updateCommentQuery = () => {
  return `
      UPDATE 
        COMMENTS 
      SET 
        {s} 
      WHERE 
        CID = {CID}`;
};
const _fetchCommentAuthorQuery = () => {
  return `
      SELECT 
        USER_ID as userId 
      FROM 
        COMMENTS 
      WHERE 
        CID = ?
      `;
};

const _deleteCommentQuery = () => {
  return `
  DELETE 
  FROM 
    COMMENTS 
  WHERE 
    CID=?`;
};

module.exports = {
  _commentInsertQuery,
  _updateCommentQuery,
  _fetchCommentAuthorQuery,
  _deleteCommentQuery,
};
