const sendToken = require('../utils/sendToken');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Packer = require('../models/Packer');
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order");
const admin = require("../config/firebase.config");


exports.googleLogin = catchAsyncErrors(async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ message: "Invalid Token" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedValue = await admin.auth().verifyIdToken(token);

        if (!decodedValue) {
            return res.status(500).json({ success: false, message: "Unauthorized user" });
        }

        const packer = await Packer.findOne({ userId: decodedValue.user_id });

        if (!packer) {
            // User does not exist, create a new user
            const newUser = new Packer({
                name: decodedValue.name,
                email: decodedValue.email,
                userId: decodedValue.user_id,
                uid: decodedValue.uid,
                role: "packer",
            });

            const savedUser = await newUser.save();
            
            // Log the token before sending
            console.log("Generated Token:", savedUser.generateAuthToken());
            
            // sendToken may already send the response, so return here
            return sendToken(savedUser, 201, res);
        } else {
            // User already exists, handle accordingly
            // Log the token before sending
            console.log("Generated Token:", user.generateAuthToken());
            
            // sendToken may already send the response, so return here
            return sendToken(user, 200, res);
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});

// get user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        packer: req.packer
    })
})

// update user 
exports.updatePacker = catchAsyncErrors(async (req, res, next) => {
    const { name, email, birthdate, purpose, mobile } = req.body;
    const userUid = req.params.uid; // Assuming the user UID is passed in the URL parameters

    const packer = await Packer.findOneAndUpdate({ uid: userUid }, {
        $set: {
            name,
            email,
            birthdate,
            purpose,
            mobile
        }
    }, { new: true , runValidators: true});

    if (!packer) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        packer
    });
});

// get all packerss --admin
exports.getAllPackers = catchAsyncErrors(async (req, res, next) => {
    const packers = await Packer.find();

    res.status(200).json({
        success: true,
        packers
    })
})