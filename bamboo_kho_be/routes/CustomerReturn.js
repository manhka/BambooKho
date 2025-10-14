const express = require("express");
const router = express.Router();
const customerReturnController = require("../controllers/CustomerReturnController");

router.post("/create", customerReturnController.createCustomerReturn);

// router.get("/list", customerReturnController.g);

// router.get("/export", customerReturnController.exportReturnOrdersExcel);

module.exports = router;
