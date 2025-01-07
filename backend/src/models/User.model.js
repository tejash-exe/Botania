import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Error! Must include name'],
    },
    email: {
        type: String,
        required: [true, 'Error! Must include email'],
        unique: [true, 'Error! Email must be unique']
    },
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/botania/image/upload/v1719074658/sample.jpg'
    },
    password: {
        type: String,
        required: [true, 'Error! Must include password'],
    },
    refreshToken: {
        type: String,
        default: "",
    },
    orderId: {
        type: String,
        default: "",
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
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

userSchema.path('cart').validate(function (value) {
    return value.length <= 10;
}, 'Error! Cart cannot have more than 10 items.');

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            profilePicture: this.profilePicture,
        },
        process.env.USER_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRY,
        }
    )
};
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.USER_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.USER_REFRESH_TOKEN_EXPIRY,
        }
    )
};

const User = mongoose.model('User', userSchema);

export default User;