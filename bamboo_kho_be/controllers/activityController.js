const pool = require("../configs/db");

exports.createActivity = async (req, res) => {
  try {
    const { ActivityName, Description } = req.body;

    if (!ActivityName) return res.status(400).json({ message: "Thiếu tên hoạt động" });

    await pool.query(
      "INSERT INTO Activity (ActivityName, Description, CreateAt, UpdateAt) VALUES (?, ?, NOW(), NOW())",
      [ActivityName, Description || null]
    );

    res.status(201).json({ message: "Tạo hoạt động thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.assignActivity = async (req, res) => {
  try {
    const { UserID, ActivityID } = req.body;

    if (!UserID || !ActivityID)
      return res.status(400).json({ message: "Thiếu UserID hoặc ActivityID" });

    // 🔍 Kiểm tra người dùng có tồn tại không
    const [userRows] = await pool.query("SELECT UserID, RoleID FROM User WHERE UserID = ?", [UserID]);
    if (userRows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });

    const user = userRows[0];

    // ⚠️ Nếu là admin (RoleID = 2) thì không cho giao
    if (user.RoleID === 2)
      return res.status(400).json({ message: "Không thể giao hoạt động cho admin" });

    // ✅ Kiểm tra hoạt động có tồn tại không
    const [activityRows] = await pool.query("SELECT ActivityName FROM Activity WHERE ActivityID = ?", [ActivityID]);
    if (activityRows.length === 0)
      return res.status(404).json({ message: "Hoạt động không tồn tại" });

    // ✅ Giao hoạt động
    await pool.query(
      "INSERT INTO StaffActivity (UserID, ActivityID, CreateAt, UpdateAt) VALUES (?, ?, NOW(), NOW())",
      [UserID, ActivityID]
    );

    res.status(201).json({
      message: `Đã giao hoạt động '${activityRows[0].ActivityName}' cho nhân viên ID ${UserID} thành công.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Activity ORDER BY CreateAt DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getStaffActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT sa.StaffActivityID, a.ActivityName, a.Description, sa.CreateAt, sa.UpdateAt
       FROM StaffActivity sa
       JOIN Activity a ON sa.ActivityID = a.ActivityID
       WHERE sa.UserID = ?`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
