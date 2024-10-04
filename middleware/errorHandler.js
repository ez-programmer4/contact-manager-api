const { constants } = require("../contacts");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.UNAUTHORIZED:
      res.status(constants.UNAUTHORIZED).json({
        title: "Unauthorized",
        message: "You do not have permission to access this resource.",
      });
      break;

    case constants.FORBIDDEN:
      res.status(constants.FORBIDDEN).json({
        title: "Forbidden",
        message: "Access to this resource is forbidden.",
      });
      break;

    case constants.NOT_FOUND:
      res.status(constants.NOT_FOUND).json({
        title: "Not Found",
        message: "The requested resource could not be found.",
      });
      break;

    case constants.SERVER_ERROR:
      res.status(constants.SERVER_ERROR).json({
        title: "Server Error",
        message: "An unexpected error occurred on the server.",
        stackTrace: err.stack,
      });
      break;

    default:
      res.status(500).json({
        title: "Unexpected Error",
        message: "An unexpected error occurred.",
      });
      break;
  }
};

module.exports = errorHandler;
