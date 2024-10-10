const successMessage = (statusValue, dataValue) => {
  return {
    status: statusValue,
    data: dataValue,
  };
};

module.exports = { successMessage };
