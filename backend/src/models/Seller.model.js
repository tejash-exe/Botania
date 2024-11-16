import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const sellerSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        default: false,
    },
    brandName:{
        type: String,
        required: [true, 'Error! Must include Brand name!'],
    },
    name: {
        type: String,
        required: [true, 'Error! Must include name!'],
    },
    contactNo: {
        type: Number,
        required: [true, 'Error! Must include contact number!'],
    },
    email: {
        type: String,
        required: [true, 'Error! Must include email!'],
        unique: [true, 'Error! Email must be unique!'],
    },
    password: {
        type: String,
        required: [true, 'Error! Must include password!'],
    },
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/botania/image/upload/v1719074658/sample.jpg',
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    refreshToken: {
        type: String,
        default: "",
    },
    products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
}, { timestamps: true });

sellerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

sellerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

sellerSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
        },
        process.env.SELLER_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.SELLER_ACCESS_TOKEN_EXPIRY,
        }
    )
};
sellerSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.SELLER_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.SELLER_REFRESH_TOKEN_EXPIRY,
        }
    )
};

const Seller = mongoose.model('Seller', sellerSchema);

export default Seller;