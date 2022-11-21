const db = require('./models/index');


exports.isAdmin = async function(req, res, next) {
    console.log("user",req.user.userType)
    if (req.user.userType === 'admin') {
      return next();
    }
    return res.status(401).json({
      status: 'Unauthorized',
      message: `Request by ${req.user.email}, this incident will be reported`
    });
  };