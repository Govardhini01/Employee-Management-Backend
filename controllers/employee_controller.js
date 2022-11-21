const db = require("../models/index")
var moment = require('moment-timezone');

//checkin
exports.checkIn = async(req,res)=>{
    try{
        let currentTime = moment().tz("America/New_York").format("YYYY-MM-DD HH:mm:ss") 
        console.log("kk",moment(currentTime).add(330,'minutes'));    
        console.log("date",moment(currentTime).format("MM/DD/YYYY"))
        console.log("user",req.user)
        let today_checkin = {
            checkIn:moment(currentTime).add(330,'minutes'),
            userId:req.user._id,
            date:moment(currentTime).format("MM/DD/YYYY")
        }
        if(req.user.checkedIn){
            return res.status(200).json({
                message:"user already checkedin for today"
              })
            }
            let today_timesheet =  await db.Timesheet.create(today_checkin)
                
                  console.log("register",today_timesheet)
                 await db.User.findOneAndUpdate({_id:req.user._id},{checkedIn:true,$push:{timesheets:today_timesheet._id}})
                 
                  return res.status(200).json(today_timesheet)
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}

exports.checkOut = async(req,res)=>{
    try{
        let currentTime = moment().tz("America/New_York").format("YYYY-MM-DD HH:mm:ss") 
        console.log("kk",moment(currentTime).add(330,'minutes'));    
        console.log("user",req.user)
       
        if(!req.user.checkedIn){
            return res.status(200).json({
                message:"user already checkedout for today"
              })
            }
            await db.Timesheet.findOneAndUpdate({_id:req.params.checkinID},{checkOut:moment(currentTime).add(330,'minutes')})
                
                 await db.User.findOneAndUpdate({_id:req.user._id},{checkedIn:false})

                 let updated_timesheet = await db.Timesheet.findOne({_id:req.params.checkinID})
                 let newT = moment(updated_timesheet.checkOut).diff(updated_timesheet.checkIn,'minutes')
                 var numhours = Math.floor((newT % 1440) / 60);
                 var numminutes = Math.floor((newT % 1440) % 60);
                 updated_timesheet.workingHours = `${numhours}hours ${numminutes}minutes`
                 updated_timesheet.save()
                console.log("aaaa",numhours,numminutes)
                  return res.status(200).json(updated_timesheet)
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}

exports.getTimesheet = async(req,res)=>{
    try{
        
            let today_timesheet =  await db.Timesheet.find({userId:req.user._id}).sort({checkIn:"desc"})
                
                  console.log("register",today_timesheet)
                 
                  return res.status(200).json(today_timesheet)
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}

exports.profile = async(req,res)=>{
    try{
        
            let getJoiningDate =  await db.Timesheet.find({userId:req.user._id}).sort({checkIn:"asc"}).limit(1)
                  console.log("register",getJoiningDate)
                  req.user.joiningDate = getJoiningDate[0].date
                  return res.status(200).json({
                    email:req.user.email,
                    joiningDate:getJoiningDate[0].date
                  })
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }
}