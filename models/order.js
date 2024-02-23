// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   dates: {
//     type: String,
//     required: true,
//   },
//   orderTime: {
//     type: String,
//     required: false,
//   },
//   movingTo: {
//     type: String,
//     required: false,
//   },
//   movingFrom: {
//     type: String,
//     required: false,
//   },
//   distance: {
//     type: String,
//     enum: ['Within the City', 'Outside City'],
//     required: false,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: false,
//   },
//   acceptedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Packer',
//   },
//   payment: {
//     type: String,
//     required: false,
//   },
//   orderCompletion: {
//     type: String,
//     enum: ['Processing', 'Approved', 'Completed'],
//     default: 'Processing',
//   },
//   tracking: [
//     {
//       status: {
//         type: String,
//         enum: ['Processing', 'Picked', 'Completed'],
//         default: 'Processing',
//         required: false,
//       },
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   furniture: [
//     {
//       category: {
//         type: String,
//         required: true,
//       },
//       subCategory: {
//         type: String,
//         required: true,
//       },
//       itemName: {
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   appliances: [
//     {
//       category: {
//         type: String,
//         required: true,
//       },
//       subCategory: {
//         type: String,
//         required: true,
//       },
//       itemName: {
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   cartons: [
//     {
//       category: {
//         type: String,
//         required: true,
//       },
//       subCategory: {
//         type: String,
//         required: true,
//       },
//       itemName: {
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   singleLayerPacking: {
//     type: Boolean,
//     default: false,
//   },
//   multiLayerPacking: {
//     type: Boolean,
//     default: false,
//   },
//   carpenterCharges: {
//     type: Boolean,
//     default: false,
//   },
//   acUninstallation: {
//     type: Boolean,
//     default: false,
//   },
//   acInstallation: {
//     type: Boolean,
//     default: false,
//   },
//   tvMounting: {
//     type: Boolean,
//     default: false,
//   },
//   razorpayOrderId: {
//     type: String,
//     required: false,
//   },
// }, { timestamps: true });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    form: {
      movingFrom: String,
      movingFromHasLift: Boolean,
      movingFromFloor: String,
      movingTo: String,
      movingToHasLift: Boolean,
      movingOn: String,
    },
    selectedItems: {
      type: Map,
      of: {
        item: String,
        count: Number,
      },
    },
    truckDetails: {
      counts: {
        "Small Truck": Number,
        "Pickup Truck": Number,
        "Box Truck": Number,
        "Flatbed truck Truck": Number,
      },
      selectedTruck: {
        type: String,
        count: Number,
      },
    },
    pricingModal: [
      {
        packageName: String,
        price: Number,
      },
    ],
    bookingDetails: {
      selectedDate: String,
      selectedTime: String,
      selectedCoupon: String,
    },
    totalAmount: {
          type: Number,
          required: true,
        },
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
    acceptedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Packer',
        },
    payment: {
          type: String,
          required: false,
        },
    orderCompletion: {
          type: String,
          enum: ['Processing', 'Approved', 'Completed'],
          default: 'Processing',
        },
    tracking: [
          {
            status: {
              type: String,
              enum: ['Processing', 'Picked', 'Completed'],
              default: 'Processing',
              required: false,
            },
            timestamp: {
              type: Date,
              default: Date.now,
            },
          },
        ],
    razorpayOrderId: {
          type: String,
          required: false,
        },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
