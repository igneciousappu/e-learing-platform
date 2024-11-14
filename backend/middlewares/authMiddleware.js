const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Get the Authorization header from the request
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(401).send({
        message: "Authorization header is missing",
        success: false,
      });
    }

    // Extract the token from the Authorization header (assuming format: "Bearer <token>")
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Token is missing",
        success: false,
      });
    }

    // Verify the token using JWT
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token is not valid",
          success: false,
        });
      }

      // Attach user ID from decoded token to the request body and proceed
      req.body.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};
