import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, 'Error! Must include product!'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Error! Must include user!'],
    },
    subject: {
        type: String,
        required:  [true, 'Error! Must include subject!'],
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

const ProductReview = mongoose.model('ProductReview', productReviewSchema);

export default ProductReview;