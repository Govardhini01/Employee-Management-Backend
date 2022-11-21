const express = require("express");
const router = express.Router();

const {register,login,logout,changePassword} = require("../controllers/auth_controller")

router.post("/user/signup",register)
router.post("/user/signin",login)
router.get("/user/logout/:id",logout)
router.post("/user/changepassword",changePassword)


module.exports = router;