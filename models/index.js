const mongoose = require("mongoose");
mongoose.set("debug",true)
mongoose.Promise=Promise
require('dotenv').config();

mongoose.connect(
    `mongodb://localhost:27017/project-management`,{
        useNewUrlParser : true,
        useUnifiedTopology: true
    }

).then(()=>{
    console.log("connection successfull")
})

exports.User = require('../models/user_model')
exports.Timesheet = require("../models/timesheet_model")
