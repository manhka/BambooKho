const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Thiếu token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.roleID !== 2)
    return res.status(403).json({ message: "Chỉ admin mới được phép 1" + req.user.roleID });
  next();
};
