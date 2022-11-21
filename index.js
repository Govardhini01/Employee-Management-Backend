const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config()
app.use(cors());

app.use(express.json());

// database
const database = require("./models/index");
const protect = require("./protect")
const middleware = require("./middleware")
// sample route
app.get("/gettt", (req, res) => {
  res.status(200).json({ message: "Welcome to employee management application." });
});


const auth_route = require("./routes/auth_route")
 const admin_route = require("./routes/admin_route")
const employee_route = require("./routes/employee_route")
// routes
 app.use("/auth",auth_route)
 app.use("/employee",protect.protect,employee_route)

app.use("/admin",protect.protect,middleware.isAdmin,admin_route)
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
