const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Packer = require("../models/packer_mover");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    
    const {token} = req.cookies
  
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource.", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decodedData.id)

    console.log("user",user)
    if (!user) {
        return next(new ErrorHandler("Please Login to access this resource.", 401))
    }
    req.user = user;
    next();
})

exports.isAuthenticatedPacker = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource.", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const packer = await Packer.findById(decodedData.id)
    

    if (!packer) {
        return next(new ErrorHandler("Please Login to access this resource.", 401))
    }

    req.packer = packer;
    next();
})

exports.authorizedRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`role: ${req.user.role} is not allowed to access this resource.`, 403));
        }

        next()
    }
}



