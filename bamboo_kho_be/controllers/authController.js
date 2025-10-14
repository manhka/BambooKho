const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../configs/db");

exports.register = async (req, res) => {
  try {
    const { username, password, phone, roleId } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
    }

    const [userCheck] = await pool.query(
      "SELECT * FROM User WHERE Username = ?",
      [username]
    );
    if (userCheck.length > 0) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO User (Username, Password, Phone, Status, RoleID) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, phone || null, true, roleId || 1]
    );

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("❌ Lỗi register:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Thiếu username hoặc password" });

    const [users] = await pool.query("SELECT * FROM User WHERE Username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const user = users[0];
    let isMatch = false;

    if (user.RoleID === 2) {
      isMatch = password === user.Password;
      console.log("plain:", isMatch);
    } else {
      isMatch = await bcrypt.compare(password, user.Password);
      console.log("hash:", isMatch);
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { userId: user.UserID, roleID: user.RoleID },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        roleID: user.RoleID,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};