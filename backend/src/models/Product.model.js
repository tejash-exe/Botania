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
    images: [
        {
            type: String,
            validate: {
                validator: function(value) {
                    return this.images.length >= 1 && this.images.length <= 6;
                },
                message: 'Error! You must upload between 1 and 6 images!',
            },
        }
    ],
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;