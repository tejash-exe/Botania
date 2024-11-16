import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Error! Must include name'],
    },
    description: {
        type: String,
        required: [true, 'Error! Must include description'],
    },
    availability:{
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'Error! Price must be a non-negative number'],
        max: [5000, 'Error! Price must be less than or equal to 5000'],
        required: [true, 'Error! Must include price'],
    },
    coverImage: {
        type: String,
        required: [true, "Error! Cover image not found"],
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
    quantity: {
        type: Number,
        default: 1,
        min: [0, 'Error! Quantity must be a non-negative number'],
        required: [true, 'Error! Must include quantity'],
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;