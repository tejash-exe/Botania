import mongoose from "mongoose";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import options from "../utils/CookiesOptions.js";
import ProductReview from "../models/ProductReview.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const generateAccessAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (!user) {
            throw new Error("User not found!");
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message);
    };
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if ([name, email, password].some((field) => field?.trim() === "")) {
            throw new Error("Error! Required fields are missing");
        };

        const checkUser = await User.findOne({ email: email.trim() });
        if (checkUser) throw new Error("Error! User already exists");

        const savedUser = await User.create(
            {
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
            }
        )
            .catch((error) => { throw new Error("Error while saving user information!") });

        const user = await User.findById(savedUser._id).select("-password -refreshtoken")
        res.json(new ApiResponse(200, "Successfully registered!", user));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if ([email, password].some((field => field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        const user = await User.findOne({ email: email?.trim() });
        if (!user) throw new Error("User does not exist!");

        const isPasswordValid = await user.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken").lean();

        const productIds = loggedInUser.wishlist.map(item => item.product._id);
        loggedInUser.wishlist = productIds;

        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "Logged in Succesfully!", {
                user: loggedInUser,
                accessToken,
                refreshToken
            }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const logoutUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set: {
                    refreshToken: "",
                },
            },
            {
                new: true,
            });
        if (!user) {
            throw new Error("Cannot find user!");
        }

        res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, "Logged out Succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        if (name?.trim() === "") throw new Error("Name is required!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        user.name = name?.trim();

        const savedUser = await user.save()
            .catch((error) => { throw new Error("Error while saving!") });

        const updatedUser = await User.findById(savedUser._id).select("-password -refreshToken");

        res.json(new ApiResponse(200, "Name changed successfully!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateProfilepicture = async (req, res) => {
    try {
        const profilePicturePath = req.file?.path;
        if (!profilePicturePath) throw new Error("Profile picture is missing!");

        const user = await User.findById(req.user._id)
            .catch(error => { throw new Error("Cannt find user!") });

        const profilePictureUrl = await uploadOnCloudinary(profilePicturePath)
            .catch(error => { throw new Error("Cannot able to upload!") });

        user.profilePicture = profilePictureUrl;
        const savedUser = await user.save()
            .catch(error => { throw new Error("Error while saving!") });

        const updatedUser = await User.findById(savedUser._id).select("-password -refreshToken");

        res.json(new ApiResponse(200, "Profile picture updated successfully!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const addToWishlist = async (req, res) => {
    try {
        const productId = req.body.productId;
        if (!productId) throw new Error("Product Id not found!");

        const product = await Product.findById(productId)
            .catch(error => { throw new Error("Cannot find product!") });

        const user = req.user;

        const alreadyInWishlist = user.wishlist.some(item => item.product.equals(productId));
        if (alreadyInWishlist) throw new Error("Product already wishlisted!");

        // Add product to wishlist with current time
        user.wishlist.push({
            product: productId,
            time: new Date()
        });

        const savedUser = await user.save()
            .catch(error => { throw new Error("Cannot wishlist product!") });
        // console.log(savedUser);
        // console.log("Product wishlisted!");

        const updatedUser = await User.findById(savedUser._id).select("-password -refreshToken").lean()
            .catch(error => { throw new Error("Cannot find user!") });

        const productIds = updatedUser.wishlist.map(item => item.product._id);
        updatedUser.wishlist = productIds;

        res.json(new ApiResponse(200, "Product added to wishlist!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const productId = req.body.productId;
        if (!productId) throw new Error("Product Id not found!");

        const product = await Product.findById(productId)
            .catch(error => { throw new Error("Cannot find product!") });

        const user = req.user;
        const objectProductId = new mongoose.Types.ObjectId(productId)
        // console.log(productId);
        // console.log(objectProductId);

        user.wishlist = user.wishlist.filter((id) => !(id.product).equals(objectProductId));
        // console.log(user.wishlist[0]);

        const savedUser = await user.save()
            .catch(error => { throw new Error("Cannot remove product from wishlist!") });
        // console.log(savedUser);
        // console.log("Product removed from wishlist!");

        const updatedUser = await User.findById(savedUser._id).select("-password -refreshToken").lean()
            .catch(error => { throw new Error("Cannot find user!") });

        const productIds = updatedUser.wishlist.map(item => item.product._id);
        updatedUser.wishlist = productIds;

        res.json(new ApiResponse(200, "Product removed from wishlist!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const findWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken").populate({
            path: 'wishlist.product'
        }).lean();

        const productsWithReviews = await Promise.all(user.wishlist.map(async (item) => {
            const reviewCount = await mongoose.model('ProductReview').countDocuments({ product: item.product._id });
            return {
                ...item,
                product: {
                    ...item.product,
                    reviewCount
                }
            };
        }));

        const wishList = productsWithReviews.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(new ApiResponse(200, "Wishlist fetched successfully!", wishList)); //user[0]
    } catch (error) {
        res.status(400).json(new ApiResponse(400, error.message));
    }
};

const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User does not exist!");

        if(user.address.length >= 3) throw new Error("Error! Already 3 addresses are there!");

        const { localAddress, landmark, city, state, pincode } = req.body;

        if ([localAddress, city, state, pincode].some((field => field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        user.address.push({
            localAddress: localAddress.trim(),
            landmark: landmark.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
        });

        const savedUser = await user.save()
            .catch(error => { throw new Error("Cannot save address!") });


    } catch (error) {
        res.status(400).json(new ApiResponse(400, error.message));
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    updateName,
    addToWishlist,
    removeFromWishlist,
    findWishlist
};