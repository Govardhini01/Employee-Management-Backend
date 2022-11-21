const mongoose = require('mongoose');
const timesheetSchema = new mongoose.Schema({
    date:{type:String},
    checkIn:{
        type:Date
    },
    checkOut:{
        type:Date
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    workingHours:{type:String}
})
const Timesheet = mongoose.model('Timesheet', timesheetSchema);
module.exports = Timesheet;
