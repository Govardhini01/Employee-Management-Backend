const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
      type: String
        },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 1
    },
    checkedIn:{type:Boolean},
    token:{type:String},
    deActivate:{
      type:Boolean,
      default:false
    },
    firstTimeLogin:{type:Boolean,default:true},
    userType:{type:String,
    enum:["admin","employee"],
    required: [true, 'Please specify your userType']},
    timesheets:[{
      type:mongoose.Schema.Types.ObjectId,
        ref: 'Timesheet'
    }]
  
  });
  
  // userSchema.pre('save', async function(next) {
  //   try {
  //     if (!this.isModified('password')) {
  //       return next();
  //     }
  //     this.password = await bcrypt.hash(this.password, 12);
  //     return next();
  //   } catch (err) {
  //     return next(new AppError(err, 400));
  //   }
  // });
  
  userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };
  const User = mongoose.model('User', userSchema);

  module.exports = User;


  