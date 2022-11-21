const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../models/index")

//register user
exports.register = async(req,res)=>{
    try{
        if(!req.body.email || !req.body.password){
            return res.status(400).json({
                err:400,
                info:"email and password required"
            })
        }
        let checkUserexists = await db.User.findOne({email:req.body.email})
        if(checkUserexists){
            return res.status(400).json({
                err:400,
                info:"email exists"
            })
        }
        if(req.body.userType == "admin"){
            req.body.firstTimeLogin = false
        }
        req.body.password = await bcrypt.hash(req.body.password,12)
            let register_user =   await db.User.create(req.body)
                  console.log("register",register_user)
                  return res.status(200).json(register_user)
                
        }catch(err){
            console.log("err",err)
            return res.status(500).json({
                code:500,
                info:"Internal Server Error"
            })
        }

  
}

exports.login = async(req,res)=>{
    try{
        const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
            err:400,
            info:"email and password required"
        })      }
      const user = await db.User.findOne({ email: email }
      ).select('+password');
      console.log("pass",await user.correctPassword(password, user.password))
      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            err:401,
            info:"Incorrect Id or  password"
        })
      }
      if(user.deActivate == true){
        return res.status(401).json({
            err:401,
            info:"Your Account has been deactivated.Please contact Admin for more information."
        })
      }
      
      if(user.firstTimeLogin == true && user.userType == "employee"){
        console.log("kk")
        return res.status(200).json(user)
      }

      createSendToken(user, 200, req, res);
    
    }catch(err){
        console.log("signin failed",err)
        return res.status(500).json({
            code:500,
            info:"Internal Server Error"
        })
    }
    }


exports.changePassword = async(req,res)=>{
    try{
        const { email,currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
            err:400,
            info:"currentPassword and new password required"
        })      }
      const user = await db.User.findOne({ email: email }
      ).select('+password');
      console.log("user",user)
      console.log("pass",await user.correctPassword(currentPassword, user.password))
      if (!user || !(await user.correctPassword(currentPassword, user.password))) {
        return res.status(401).json({
            err:401,
            info:"Incorrect Id or  password"
        })
      }
      if(user.deActivate == true){
        return res.status(401).json({
            err:401,
            info:"Your Account has been deactivated.Please contact Admin for more information."
        })
      }
      user.password = await bcrypt.hash(newPassword,12)
      user.firstTimeLogin = false
      
      createSendToken(user, 200, req, res);
    
    }catch(err){
        console.log("signin failed",err)
        return res.status(500).json({
            code:500,
            info:"Internal Server Error"
        })
    }
    }
    //logout
    exports.logout = async(req,res)=>{
        try{
            
                   await db.User.findOneAndUpdate({_id:req.params.id},{token:"N/A"})
                      return res.status(200).json({
                        message:"logout successfull"
                      })
                    
            }catch(err){
                console.log("err",err)
                return res.status(500).json({
                    code:500,
                    info:"Internal Server Error"
                })
            }
    
      
    }
    //signtoken
    const signToken = id => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "24h"
        });
      };
      
    //token
    const createSendToken = (user, statusCode, req, res) => {
        const token = signToken(user._id);
        user.token= token
      user.save()
       
          return res.status(200).json(user)
      };
      