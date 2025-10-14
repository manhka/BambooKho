const express = require("express");
const router = express.Router();
const {
  createActivity,
  assignActivity,
  getActivities,
  getStaffActivities,
} = require("../controllers/activityController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

// Admin tạo hoạt động
router.post("/create", verifyToken, verifyAdmin, createActivity);

// Admin giao hoạt động cho nhân viên
router.post("/assign", verifyToken, verifyAdmin, assignActivity);

// Lấy danh sách hoạt động (ai cũng có thể xem)
router.get("/", verifyToken, getActivities);

// Lấy hoạt động của 1 nhân viên
router.get("/staff/:userId", verifyToken, getStaffActivities);

module.exports = router;
