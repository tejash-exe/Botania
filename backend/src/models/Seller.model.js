import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const sellerSchema = new mongoose.Schema({
    activated: {
        type: Boolean,
        default: false,
    },
    razorpay: {
        email:{
            type: String,
            unique: [true, 'Error! Email for Razorpay must be unique!'],
            sparse: true,
            default: '',
        },
        accountId:{
            type: String,
            default: "",
        },
        stakeholderId:{
            type: String,
            default: "",
        },
        routeconfigId:{
            type: String,
            default: "",
        },
        activationStatus:{
            type: String,
            default: "",
        },
        beneficiary_name:{
            type: String,
            default: "",
        },
        account_number:{
            type: String,
            default: "",
        },
        ifsc_code:{
            type: String,
            default: "",
        },
    },
    brandName:{
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: [true, 'Error! Must include name!'],
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
    address: {
        localAddress: {
            type: String,
            required: [true, 'Error! Must include local address!'],
            default: "NIT",
        },
        landmark: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            required: [true, 'Error! Must include city!'],
            default: "Jamshedpur",
        },
        state: {
            type: String,
            required: [true, 'Error! Must include state!'],
            default: "Jharkhand",
        },
        pincode: {
            type: String,
            required: [true, 'Error! Must include pincode!'],
            default: '111111',
        },
        contact: {
            type: String,
            required: [true, 'Error! Must include contact number!'],
            default: '1111111111',
        }
    },
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