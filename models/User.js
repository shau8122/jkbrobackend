const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: [validator.isEmail, "Please enter valid email"],
        unique: true
    },
    birthdate: {
        day: {
          type: String,
          required: true,
        },
        month: {
          type: String,
          required: true,
        },
        year: {
          type: String,
          required: true,
        },
      },
    uid: {
        type: String,
    },
    mobile : { 
        type : Number,
    },
    userId : {
        type: String,
        required: true
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    purpose: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
}, { timestamps: true });

// generate auth token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE} )
}


const User = mongoose.model("Users", userSchema);

module.exports = User;
