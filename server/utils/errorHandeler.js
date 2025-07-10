// errorHandler

const errorHandler = (error, req, res, next) => {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation Error", reason: error.message });
    }
  
    if (error.name === "NotFoundError") {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.name === "BadRequestError") {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.name === "InvalidEntry") {
      return res.status(error.status).json({ error: error.message });
    }
  
    //return res.status(500).json({ error: "Server Error", reason: error.message });
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
      stack: process.env.APP_ENV === "production" ? undefined : error.stack,
    });
  };
  
  module.exports = errorHandler;
  