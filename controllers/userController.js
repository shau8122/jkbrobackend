const sendToken = require("../utils/sendToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
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
      return res
        .status(500)
        .json({ success: false, message: "Unauthorized user" });
    }

    const user = await User.findOne({ userId: decodedValue.user_id });

    if (!user) {
      // User does not exist, create a new user
      const newUser = new User({
        name: decodedValue.name,
        email: decodedValue.email,
        userId: decodedValue.user_id,
        uid: decodedValue.uid,
        role: "user",
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

//  sign up
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, userId, birthdate, purpose, mobile, role } = req.body;

  const user = await User.findOne({ userId });
  console.log(user);
  if (user) {
    return res.status(422).json({ error: "User Already Exist " });
  } else {
    const user = await User.create({
      name,
      birthdate,
      email,
      userId,
      mobile,
      purpose,
      role,
    });
    sendToken(user, 201, res);
  }
});

// // login user
// exports.loginUser = catchAsyncErrors(async (req, res, next) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//     }

//     if (!password) {
//         return next(new ErrorHandler("Please enter password", 400));
//     }

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//         return next(new ErrorHandler("Password incorrect"));
//     }

//     sendToken(user, 200, res);
// })

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/"
  });
  
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// get user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.params.userId;
      
      const user = await User.findOne({ userId });
      if (user) {
        sendToken(user, 201, res);
      } else {
        return res.status(404).json({ error: "User not found" }); // Adjust status code and error message as per your requirement
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal Server Error" }); // Adjust status code and error message as per your requirement
    }
  });

// update user
exports.updateUsers = catchAsyncErrors(async (req, res, next) => {
  const { name, email, birthdate, purpose, mobile } = req.body;
  console.log(req.user)
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        name,
        email,
        birthdate,
        purpose,
        mobile,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user,
  });
});
// update user
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, birthdate, purpose, mobile } = req.body;
  const userId = req.params.userId; // Assuming the user UID is passed in the URL parameters
  console.log(userId)
  const user = await User.findOneAndUpdate(
    { userId },
    {
      $set: {
        name,
        email,
        birthdate,
        purpose,
        mobile,
      },
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// delete user
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const usersOrders = await Order.find({
    user: req.user.id,
  });

  if (usersOrders.length > 0) {
    await Promise.all(usersOrders.map(async (Order) => await Order.delete()));
  }

  await user.delete();
  res.status(200).json({
    success: true,
    message: "User deleted succussfully",
  });
});

// get user details -- admin
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const uid = req.params.id;

  const user = await User.findById(uid);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// get all users --admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// change user role -- admin
exports.chageUserRole = catchAsyncErrors(async (req, res, next) => {
  const uid = req.params.uid;
  const role = req.body.role;

  if (id === req.user.uid) {
    return next(new ErrorHandler("You can't change change your own role", 400));
  }

  const user = await User.findById(uid);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (role !== "user" && role !== "admin") {
    return next(new ErrorHandler("Only user and admin role available", 400));
  }

  user.role = role;

  await user.save();
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
