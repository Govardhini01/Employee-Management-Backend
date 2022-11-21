const db = require("../models/index")

//deactivate user
exports.deActivateEmployee = async(req,res)=>{
    try{
      
            let user =  await db.User.findById(req.params.id)
                  console.log("register",user)
                  user.deActivate=true
                  user.save()
                  return res.status(200).json({
                    message:"user deactivated successfully"
                  })
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}
exports.ActivateEmployee = async(req,res)=>{
    try{
      
            let user =  await db.User.findById(req.params.id)
                  console.log("register",user)
                  user.deActivate=false
                  user.save()
                  return res.status(200).json({
                    message:"user activated successfully"
                  })
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}



//get Employee List
exports.getEmployeeList = async(req,res)=>{
    try{
      
            let employeeList =  await db.User.find({userType:'employee'},{'email':1,'_id':1,'userType':1,'deActivate':1})
                
                  return res.status(200).json(employeeList)  
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}

//viewEmployee
exports.viewEmployee = async(req,res)=>{
    try{
      
            let employee =  await db.User.findOne({_id:req.params.employeeId},{email:1,deActivate:1}).populate('timesheets')
            let getJoiningDate =  await db.Timesheet.find({userId:req.params.employeeId}).sort({checkIn:"asc"}).limit(1)
            console.log("get",getJoiningDate)    
                console.log("emply",employee)
            return res.status(200).json({employee:employee,joiningdate:getJoiningDate[0].date})
                
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
        
            let employeeCount =  await db.User.find({userType:"employee"}).count()
            let deActivateEmployeeCount = await db.User.find({deActivate:true}).count()
            
                  return res.status(200).json({
                    email:req.user.email,
                    totalEmployees:employeeCount,
                    deActivatedEmployees:deActivateEmployeeCount
                  })
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}