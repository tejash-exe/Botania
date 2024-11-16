import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    localAddress: {
        type: String,
        required: [true, 'Error! Must include local address!'],
    },
    landmark: {
        type: String,
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
        type: Number,
        required: [true, 'Error! Must include pincode!'],
    },
    default: {
        type: Boolean,
        default: false
    }
});

export default addressSchema;