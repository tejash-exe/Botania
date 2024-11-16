import mongoose from "mongoose";
import addressSchema from "./Address.schema.js";

const orderSchema = mongoose.Schema({
    product:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Error! Product information is required!'],
    },
    boughtBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Error! User information is required!'],
    },
    address: addressSchema,
    deliveryStatus: {
        type: String,
        enum: {
            values: ['Delivered', 'On the way', 'Shipped', 'Packing', 'Processing by seller'],
            message: 'Error! {VALUE} is not a valid delivery status.',
        },
        default: 'Processing by seller',
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;