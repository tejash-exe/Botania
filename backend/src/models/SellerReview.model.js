import mongoose from "mongoose";

const sellerReviewSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, 'Error! Must include order!'],
        unique: [true, 'Error! Must have unique order!'],
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: [true, 'Error! Must include seller!'],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, 'Error! Must include product!'],
    },
    madeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Error! Must include User!'],
    },
    description: {
        type: String,
        required: [true, 'Error! Must include description!'],
    },
    images: [
        {
            type: String,
            validate: {
                validator: function(value) {
                    return this.images.length <= 5;
                },
                message: 'Error! You can upload a maximum of 5 images!',
            },
        }
    ],
    rating: {
        type: Number,
        required: [true, 'Error! Rating is required!'],
        enum: {
            values: [1, 2, 3, 4, 5],
            message: 'Error! Rating must be between 1 and 5!',
        },
    },
},{ timestamps: true });

const SellerReview = mongoose.model('SellerReview', sellerReviewSchema);

export default SellerReview;