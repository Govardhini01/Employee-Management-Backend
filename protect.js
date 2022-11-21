const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const db = require('./models/index');

exports.protect = (async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } 
  
    if (!token) {
      console.log("token")
      return res.status(401).json({
        code:401,
        message:'You are not logged in! Please log in to get access.'
    });
    }
  
    // 2) Verification token
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //.then((err,res)=>{
  //     if(err){
  //       console.log("error")
  //     }
  //   }).catch((err)=>{
  // console.log("erroar")
  //   })
    
    // 3) Check if user still exists
  
    var currentuser = await db.User.findById(decoded.id);
    console.log("hello")
   var currentUser;
  if(currentuser ==undefined){
    const presentUser = await db.User.findById(decoded.id)
    
    
    if (!presentUser) {
      console.log("here")
      return next('The user belonging to this token no longer exist.', 401)
    
    }
    req.user = presentUser
    currentUser = presentUser
  }else{
    currentUser = currentuser
  }
  
    
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next('User recently changed password! Please log in again.', 401)
      
    }
    
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  });
  