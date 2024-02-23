const mongoose = require('mongoose');
const validator = require('validator');


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
    jobLocation: {
        type: String,
        required: true
    },
    dob: {
        type: String,
    },
    uid: {
        type: String,
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    mobile : { 
        type : Number
    },
    acceptedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    role: {
        type: String,
        default: 'packer',
        enum: ['packer', 'mover']
    }
}, { timestamps: true });


const Packer = mongoose.model("Packer", userSchema);

module.exports = Packer;