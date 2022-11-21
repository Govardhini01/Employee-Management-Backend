const express = require("express");
const router = express.Router();

const {deActivateEmployee,profile,getEmployeeList,ActivateEmployee,viewEmployee} = require("../controllers/admin_controller")

router.get("/deactivate/:id",deActivateEmployee)
router.get("/employeeList",getEmployeeList)
router.get("/activate/:id",ActivateEmployee)
router.get("/profile/employee/:employeeId",viewEmployee)
router.get("/profile",profile)

module.exports = router;