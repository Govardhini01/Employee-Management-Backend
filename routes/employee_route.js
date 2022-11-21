const express = require("express");
const router = express.Router();
const {checkIn,checkOut,getTimesheet,profile} = require("../controllers/employee_controller")

router.get("/checkin",checkIn)
router.get("/checkout/:checkinID",checkOut)
router.get("/timesheet",getTimesheet)
router.get("/profile",profile)

module.exports = router;