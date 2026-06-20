const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No Token" });
  }

  const logintoken = token.split(" ")[1];
  console.log(logintoken);

  try {
    const decoded = jwt.verify(logintoken, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);

    // ✅ Only call next() if verification succeeds
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;