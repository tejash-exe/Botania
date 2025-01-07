import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Error! Product information is required!'],
        unique: [true, 'Error! Cannot make multiple orders for the same product!'],
    },
    boughtBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Error! User information is required!'],
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: [true, 'Error! Seller information is required!'],
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_order_id: {
        type: String,
    },
    address: {
        name: {
            type: String,
            required: [true, 'Error! Must include name!'],
        },
        localAddress: {
            type: String,
            required: [true, 'Error! Must include local address!'],
        },
        landmark: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            required: [true, 'Error! Must include city!'],
        },
        state: {
            type: String,
            required: [true, 'Error! Must include state!'],
        },
        pincode: {
            type: String,
            required: [true, 'Error! Must include pincode!'],
        },
        contact: {
            type: String,
            required: [true, 'Error! Must include contact number!'],
        }
    },
    deliveryStatus: {
        type: String,
        enum: {
            values: ['Shipped', 'Packing', 'Delivered'],
            message: 'Error! {VALUE} is not a valid delivery status.',
        },
        default: 'Packing',
    },
    shippedOn: {
        type: Date,
    },
    deliveredOn: {
        type: Date,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;