import mongoose from "mongoose";
import User from "../models/User.model.js";
import Order from "../models/Order.model.js";
import Seller from "../models/Seller.model.js";
import Product from "../models/Product.model.js";
import SellerReview from "../models/SellerReview.model.js";
//Utils
import 'dotenv/config';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import options from "../utils/CookiesOptions.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const key_id = process.env.RAZORPAY_TEST_ID;
const key_secret = process.env.RAZORPAY_TEST_KEY;

const instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

const isPaymentSuccessful = async (order_id, razorpay_payment_id, razorpay_signature) => {
    const data = `${order_id}|${razorpay_payment_id}`;

    // Generate the HMAC-SHA256 signature
    const generated_signature = await crypto
        .createHmac('sha256', key_secret)
        .update(data)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        return true;
    } else {
        return false;
    };
};

const generateAccessAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (!user) {
            throw new Error("User not found!");
        };

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        const savedUser = await user.save({ validateBeforeSave: false });
        if (!savedUser) throw new Error("Cannot save user while generating tokens!!");

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message);
    };
};

//Login-register
const registerUser = async (req, res) => {
    try {
        //Input validation
        const { name, email, password } = req.body;

        if ([name, email, password].some((field) => field == undefined || field?.trim() === "")) {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^.{0,70}$/.test(name.trim())) throw new Error("Name cannot have more than 70 letters!");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error("Email must be in valid format!");

        //Check existing users
        const checkUser = await User.findOne({ email: email.trim() });
        if (checkUser) throw new Error("Error! Email already exists");

        //Create user
        const savedUser = await User.create({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
        });
        if (!savedUser) throw new Error("Error while saving user information!");

        const user = await User.findById(savedUser._id).select("email");
        if (!user) throw new Error("Cannot find user after saving!!");

        res.json(new ApiResponse(200, "Successfully registered!", user));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const loginUser = async (req, res) => {
    try {
        //Input validation
        const { email, password } = req.body;

        if ([email, password].some((field => field == undefined || field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error("Email must be in valid format!");

        const user = await User.findOne({ email: email?.trim() });
        if (!user) throw new Error("User does not exist!");

        const isPasswordValid = await user.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        };

        //Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -orderId").lean();
        if (!loggedInUser) throw new Error("Cannot find user!!");

        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "Logged in Succesfully!", {
                user: loggedInUser,
            }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const logoutUser = async (req, res) => {
    try {
        //Find and delete tokens
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
        };

        res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, "Logged out Succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Update details
const updateName = async (req, res) => {
    try {
        //Input validation
        const { newName } = req.body;

        if (newName == undefined || newName?.trim() === "") {
            throw new Error("Error! Required field is missing");
        };

        if (!/^.{0,70}$/.test(newName.trim())) throw new Error("Name cannot have more than 70 letters!");

        //Save user
        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        user.name = newName?.trim();

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Error while saving!");

        const updatedUser = await User.findById(savedUser._id).select(" name ");
        if (!updatedUser) throw new Error("Cannot find user after saving!!");

        res.json(new ApiResponse(200, "Name changed successfully!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateEmail = async (req, res) => {
    try {
        //Input validation
        const { newEmail, password } = req.body;
        if ([newEmail, password].some((field => field == undefined || field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) throw new Error("Email must be in valid format!");

        //Check existing user
        const existedUser = await User.findOne({ email: newEmail });
        if (existedUser) throw new Error("Email already exists!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        const isPasswordValid = await user.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        };

        //Save user
        user.email = newEmail?.trim();

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Error while saving!");

        const updatedUser = await User.findById(savedUser._id).select(" email ");
        if (!updatedUser) throw new Error("Cannot find user after saving!");

        res.json(new ApiResponse(200, "Email changed successfully!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updatePassword = async (req, res) => {
    try {
        //Input validation
        const { newPassword, password } = req.body;

        if ([newPassword, password].some((field => field == undefined || field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        const isPasswordValid = await user.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        };

        //Save user
        user.password = newPassword?.trim();

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Error while saving!");

        const updatedUser = await User.findById(savedUser._id).select("-password -refreshToken");
        if (!updatedUser) throw new Error("Cannot find user after saving!!");

        res.json(new ApiResponse(200, "Password changed successfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateProfilepicture = async (req, res) => {
    try {
        //Input validation
        const profilePicturePath = req.file?.path;
        if (!profilePicturePath) throw new Error("Profile picture is missing!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("Cannt find user!");

        //Upload image
        const profilePictureUrl = await uploadOnCloudinary(profilePicturePath);
        if (!profilePicturePath) throw new Error("Cannot able to upload!");

        //Save user
        user.profilePicture = profilePictureUrl;

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Error while saving!");

        const updatedUser = await User.findById(savedUser._id).select(" profilePicture ");
        if (!updatedUser) throw new Error("Cannot find user after saving!!");

        res.json(new ApiResponse(200, "Profile picture updated successfully!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateAddress = async (req, res) => {
    try {
        //Input validation
        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User does not exist!");

        const { localAddress, landmark, city, state, pincode, contact } = req.body;

        if ([localAddress, city, state, pincode, contact].some((field => field == undefined || field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^.{0,100}$/.test(localAddress.trim())) throw new Error("Local address cannot have more than 100 letters!");

        if (!/^.{0,100}$/.test(landmark.trim())) throw new Error("Landmark cannot have more than 100 letters!");

        const pin = Number.parseInt(pincode.trim());

        const phone = Number.parseInt(contact.trim());

        if (pin < 100000 || pin > 999999) throw new Error("Pincode must have six digits!");

        if (phone < 1000000000 || phone > 9999999999) throw new Error("Contact number must have ten digits!");

        //Save user
        user.address = {
            localAddress: localAddress.trim(),
            landmark: landmark?.trim() || "",
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            contact: contact.trim(),
        };

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Cannot save address!");

        const updatedUser = await User.findById(req.user._id).select(" address ").lean();
        if (!updatedUser) throw new Error("Cannot find user after saving!!");

        res.json(new ApiResponse(200, "Address updated succesfully!", updatedUser));
    } catch (error) {
        res.status(400).json(new ApiResponse(400, error.message));
    };
};

//Wishlist
const addToWishlist = async (req, res) => {
    try {
        //Input validation
        const productId = req.body.productId;
        if (productId == undefined || productId?.trim() === "") throw new Error("Product Id not found!");

        const product = await Product.findById(productId);
        if (!product) throw new Error("Cannot find product!");

        //Check product availability
        if (product.availability == false) throw new Error("Cannot add sold products to wishlist!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        const objectProductId = new mongoose.Types.ObjectId(productId);

        //Check already exists
        const isAlreadyInWishlist = user.wishlist.some(id => id.equals(objectProductId));
        if (isAlreadyInWishlist) {
            res.json(new ApiResponse(200, "Product is already in your wishlist!", { wishlist: user.wishlist }));
        };

        //Save user
        user.wishlist.unshift(productId);

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Cannot wishlist product!");

        const updatedUser = await User.findById(savedUser._id).select(" wishlist ").lean();
        if (!updatedUser) throw new Error("Cannot find user after saving!");

        res.json(new ApiResponse(200, "Product added to your wishlist!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const removeFromWishlist = async (req, res) => {
    try {
        //Input validation
        const productId = req.body.productId;
        if (productId == undefined || productId?.trim() === "") throw new Error("Product Id not found!");

        // const product = await Product.findById(productId);
        // if(!product) throw new Error("Cannot find product!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        const objectProductId = new mongoose.Types.ObjectId(productId);

        //Check already removed
        // const isAlreadyInWishlist = user.wishlist.some(id => id.equals(objectProductId));
        // if (!isAlreadyInWishlist) {
        //     console.log("Product is already not in your wishlist!");
        // };

        //Save user
        user.wishlist = user.wishlist.filter((id) => !(id).equals(objectProductId));

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Cannot able to remove product from your wishlist!");

        const updatedUser = await User.findById(savedUser._id).select(" wishlist ").lean();
        if (!updatedUser) throw new Error("Cannot find user after saving!");

        res.json(new ApiResponse(200, "Product removed from your wishlist!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const findWishlist = async (req, res) => {
    try {
        //Fetch wishlist
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            populate: {
                path: 'soldBy',
                select: 'averageRating',
            },
        }).lean();

        if (!user) throw new Error("User not found!");

        res.json(new ApiResponse(200, "Wishlist fetched successfully!", user.wishlist));
    } catch (error) {
        res.status(400).json(new ApiResponse(400, error.message));
    };
};

//Cart
const addToCart = async (req, res) => {
    try {
        //Input validation
        const productId = req.body.productId;
        if (productId == undefined || productId?.trim() === "") throw new Error("Product Id not found!");

        const product = await Product.findById(productId);
        if (!product) throw new Error("Cannot find product!");

        //Check already sold
        if (product.availability == false) throw new Error("Cannot add sold products into cart!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        //Check limit
        const checkSize = req.user.cart?.length;
        if (checkSize == 10) throw new Error("Cart cannot have more than 10 items!");

        const objectProductId = new mongoose.Types.ObjectId(productId);

        //Check already in cart
        const isAlreadyInCart = user.cart.some(id => id.equals(objectProductId));
        if (isAlreadyInCart) {
            res.json(new ApiResponse(200, "Product is already in your cart!", { cart: user.cart }));
        };

        //Save user
        user.cart.unshift(productId);

        const savedUser = await user.save()
            .catch(error => {
                if (error.message == 'User validation failed: cart: Error! Cart cannot have more than 10 items.') {
                    throw new Error("You cannot have more than 10 items in your cart!");
                }
                else {
                    throw new Error("Cannot add product into your cart!")
                };
            });

        const updatedUser = await User.findById(savedUser._id).select(" cart ").lean();
        if (!updatedUser) throw new Error("Cannot find user!");

        res.json(new ApiResponse(200, "Product added to your cart!", updatedUser));
    } catch (error) {
        if (error.message == "You cannot have more than 10 items in your cart!") {
            res.json(new ApiResponse(468, error.message));
        }
        else {
            res.json(new ApiResponse(400, error.message));
        };
    };
};

const removeFromCart = async (req, res) => {
    try {
        //Input validation
        const productId = req.body.productId;
        if (productId == undefined || productId?.trim() === "") throw new Error("Product Id not found!");

        // const product = await Product.findById(productId);
        // if(!product) throw new Error("Cannot find product!");

        const user = await User.findById(req.user._id);
        if (!user) throw new Error("User not found!");

        const objectProductId = new mongoose.Types.ObjectId(productId);

        //Check already removed
        // const isAlreadyInCart = user.cart.some(id => id.equals(objectProductId));
        // if (!isAlreadyInCart) {
        //     console.log("Product is not in your cart!");
        // };

        //Save user
        user.cart = user.cart.filter((id) => !(id).equals(objectProductId));

        const savedUser = await user.save();
        if (!savedUser) throw new Error("Cannot able to remove product from your cart!");

        const updatedUser = await User.findById(savedUser._id).select(" cart ").lean();
        if (!updatedUser) throw new Error("Cannot find user!");

        res.json(new ApiResponse(200, "Product removed from your cart!", updatedUser));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const findCart = async (req, res) => {
    try {
        //Fetch cart
        const user = await User.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'soldBy',
                select: 'brandName',
            },
        }).lean();

        if (!user) throw new Error("User not found!");

        res.json(new ApiResponse(200, "Cart fetched successfully!", user.cart));
    } catch (error) {
        res.status(400).json(new ApiResponse(400, error.message));
    };
};

//Purchase
const orderConfirmation = async (req, res) => {
    try {
        //Fetch details
        const user = await User.findById(req.user._id).select(" cart address name email ").populate({
            path: 'cart',
            populate: {
                path: 'soldBy',
                select: 'name razorpay brandName',
            },
        }).lean();

        if (!user) throw new Error("User not found!");

        //Check already sold 
        const hasUnavailableProduct = user.cart.some((product) => product.availability === false);

        if (hasUnavailableProduct) {
            res.json(new ApiResponse(468, "At least one product is unavailable."));
            return;
        };

        const totalAmount = user.cart.reduce((x, y) => {
            return x + y.price;
        }, 0);

        user.totalAmount = totalAmount;

        //Create transfers 
        const transfers = user.cart?.map((product) => ({
            account: product.soldBy.razorpay.accountId,
            amount: product.price * 100,
            currency: "INR",
            notes: {
                product_name: product.name,
                seller_name: product.soldBy.name,
            },
            linked_account_notes: ["product_name"],
            on_hold: 0,
        }));

        //Create order
        const order = await instance.orders.create({
            amount: (totalAmount + 1) * 100,
            currency: "INR",
            transfers: transfers,
            notes: {
                userId: user._id,
            },
        }).catch((err) => console.log(err));

        // if(!order) throw new Error("Cannot able to generate reciept!");

        const fetchUser = await User.findById(user._id);
        if (!fetchUser) throw new Error("Cannot fetch user!!");

        //Save user
        fetchUser.orderId = order.id;

        const savedUser = await fetchUser.save();
        if (!savedUser) throw new Error("Cannot save user!!");

        res.json(new ApiResponse(200, "Data fetched succesfully!", { user: user, orderId: order.id, keyId: key_id }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const confirmOrder = async (req, res) => {
    try {
        //Input validation
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const order = await instance.orders.fetch(razorpay_order_id);
        if (!order) throw new Error("Inavalid order ID!!");

        const user = await User.findById(order.notes.userId).populate({
            path: 'cart',
            populate: {
                path: 'soldBy',
            },
        });
        if (!user) throw new Error("Cannot find user!!");

        //Check valid payment
        const validPayment = await isPaymentSuccessful(user.orderId, razorpay_payment_id, razorpay_signature);
        if (!validPayment) throw new Error("Payment Unsuccessful!");

        //Create orders
        const orders = await Promise.all(
            user.cart.map(async (product) => {
                return await Order.create({
                    product: product._id,
                    soldBy: product.soldBy._id,
                    boughtBy: user._id,
                    razorpay_order_id: razorpay_order_id,
                    razorpay_payment_id: razorpay_payment_id,
                    address: {
                        name: user.name,
                        localAddress: user.address.localAddress,
                        landmark: user.address.landmark,
                        city: user.address.city,
                        state: user.address.state,
                        pincode: user.address.pincode,
                        contact: user.address.contact,
                    },
                });
            })
        ).catch((error) => {
            throw new Error('One or more order creations failed!!');
        });

        //Set products to sold
        const updatedProducts = await Promise.all(
            user.cart.map(async (productId) => {
                const product = await Product.findById(productId);
                if (!product) {
                    throw new Error(`Product with ID: ${productId} not found`);
                };
                product.availability = false;
                return await product.save();
            })
        ).catch((error) => {
            throw new Error("One or more product updations failed!!");
        });

        //Save user
        const updatedUser = await User.findById(user._id);

        updatedUser.cart = [];

        const savedUser = await updatedUser.save();
        // if (!savedUser) console.log("Cannot able to save user!!");

        res.redirect(`${process.env.FRONTEND_URL}/user/payment-success/${razorpay_order_id}/${razorpay_payment_id}`);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/user/payment-error/${error.message}`);
    };
};

//Orders
const fetchOrders = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $match: {
                    boughtBy: req.user._id,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        if (!orders) throw new Error("Cannot fetch orders!!");

        res.json(new ApiResponse(200, "Orders fetch succesfully!!", orders));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const orderDetails = async (req, res) => {
    try {
        //Input validation
        const { orderId } = req.body;
        if (orderId == undefined || orderId.trim() == "") throw new Error("Required field is empty!!");

        const order = await Order.findById(orderId).populate({
            path: 'product',
        }).populate({
            path: 'soldBy',
            select: 'brandName name averageRating address profilePicture',
        }).lean();
        if (!order) throw new Error("Order does not exists!!");

        //Check order is related to user
        if (order.boughtBy._id.toString() !== req.user._id.toString()) throw new Error("Order details does not belong to user!!");

        const review = await SellerReview.findOne({ order: orderId });
        if (!review) {
            res.json(new ApiResponse(200, "Order details fetched successfully!", { order: order }));
            return;
        };

        res.json(new ApiResponse(201, "Order details with review fetched successfully!", { order: order, review: review }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const changeDeliveryStatus = async (req, res) => {
    try {
        //Input validation
        const { orderId } = req.body;
        if (orderId == undefined || orderId.trim() == "") throw new Error("Required field is empty!!");

        const order = await Order.findById(orderId);
        if (!order) throw new Error("Cannot fetch order details");

        //Check order is related to user
        if (order.boughtBy._id.toString() !== req.user._id.toString()) throw new Error("Order details does not belong to user!!");

        //Check delivery status
        if (order.deliveryStatus !== 'Shipped') throw new Error("You can only change to recieved when the order is shipped!!");

        //Save order 
        order.deliveryStatus = 'Delivered';
        order.deliveredOn = Date.now();

        const saving = await order.save();
        if (!saving) throw new Error("Cannot able to save order details!");

        const savedOrder = await Order.findById(orderId);
        if (!savedOrder) throw new Error("Cannot fetch order after saving!!");

        res.json(new ApiResponse(200, "Order updated succesfully!!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const addReview = async (req, res) => {
    try {
        //Input validation
        const { rating, description, orderId } = req.body;

        if (description == undefined || description.trim() == "") {
            throw new Error("Description field is missing!!");
        };

        if (!/^[\s\S]{0,1000}$/.test(description.trim())) throw new Error("Description cannot have more than 1000 letters!");

        if (orderId == undefined || orderId.trim() == "") {
            throw new Error("Order ID is missing!!");
        };

        if (Number.parseInt(rating) > 5 || Number.parseInt(rating) < 0) throw new Error("Rating value must be between 0 to 5!");

        if ((Number.parseInt(rating) != 1) && (Number.parseInt(rating) != 2) && (Number.parseInt(rating) != 3) && (Number.parseInt(rating) != 4) && (Number.parseInt(rating) != 5)) {
            throw new Error("Rating must be an integer!");
        };

        const order = await Order.findById(orderId).populate({
            path: 'product',
        });
        if (!order) throw new Error("Cannot find order!");

        //Check order deliverystatus
        if (order.deliveryStatus !== "Delivered") throw new Error("Order is not delivered yet!");

        //Check order belongs to user
        if (order.boughtBy.toString() !== req.user._id.toString()) throw new Error("Order does not belong to user!");

        //Check existing reviews
        const findReview = await SellerReview.findOne({ order: orderId });
        if (findReview) throw new Error("Review already exists!");

        //Find new average rating
        const seller = await Seller.findById(order.product.soldBy);
        if (!seller) throw new Error("Cannot find seller!");

        const reviewsCount = await SellerReview.countDocuments({ soldBy: seller._id });
        if (reviewsCount == undefined) throw new Error("Cannot fetch reviews count!");

        seller.averageRating = (seller.averageRating * reviewsCount + Number.parseInt(rating)) / (reviewsCount + 1);

        //Image upload
        const imageFiles = req.files;
        const filepaths = imageFiles.map((images) => images.path);

        const images = [];
        for (const paths of filepaths) {
            const image = await uploadOnCloudinary(paths);
            if (!image) throw new Error("Unable to save images on Cloudinary!");
            images.push(image);
        };

        //Create review
        const review = await SellerReview.create({
            order: orderId,
            description: description.trim(),
            rating: Number.parseInt(rating),
            images: images,
            soldBy: seller._id,
            madeBy: req.user._id,
            product: order.product._id,
        });
        if (!review) throw new Error("Cannot able to save review!");

        //Save new rating
        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Cannot able to update seller ratings");

        res.json(new ApiResponse(200, "Review added successfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateReview = async (req, res) => {
    try {
        //Input validation
        const { rating, description, orderId, deleted } = req.body;

        if ([description, orderId, deleted].some((field) => field == undefined || field?.trim() === "")) {
            throw new Error("Required fields are missing!");
        };

        if (!/^[\s\S]{0,1000}$/.test(description.trim())) throw new Error("Description cannot have more than 1000 letters!");

        if (Number.parseInt(rating) > 5 || Number.parseInt(rating) < 0) throw new Error("Rating value must be between 0 to 5!");

        if ((Number.parseInt(rating) != 1) && (Number.parseInt(rating) != 2) && (Number.parseInt(rating) != 3) && (Number.parseInt(rating) != 4) && (Number.parseInt(rating) != 5)) {
            throw new Error("Rating must be an integer!");
        };

        const order = await Order.findById(orderId).populate({
            path: 'product',
        });
        if (!order) throw new Error("Cannot find order!");

        //Check order deliverystatus
        if (order.deliveryStatus !== "Delivered") throw new Error("Order is not delivered yet!");

        //Check order belongs to user
        if (order.boughtBy.toString() !== req.user._id.toString()) throw new Error("Order does not belong to user!");

        const review = await SellerReview.findOne({ order: orderId });
        if (!review) throw new Error("Cannot find review");

        //Handle image updation
        const toDelete = Number.parseInt(deleted.trim());
        if (toDelete > 0) {
            if (review.images.length < toDelete) {
                throw new Error("Cannot delete more images than exist in the product!!");
            };
            review.images = review.images.slice(0, -toDelete);
        };

        //Find new average rating
        const seller = await Seller.findById(order.product.soldBy);
        if (!seller) throw new Error("Cannot find seller!");

        const reviewsCount = await SellerReview.countDocuments({ soldBy: seller._id });
        if (reviewsCount == undefined) throw new Error("Cannot fetch reviews count!");

        seller.averageRating = ((seller.averageRating * reviewsCount) + Number.parseInt(rating) - review.rating) / (reviewsCount);

        //Handle image upload
        const imageFiles = req.files;
        const filepaths = imageFiles.map((images) => images.path);

        const images = [];
        for (const paths of filepaths) {
            const image = await uploadOnCloudinary(paths);
            if (!image) throw new Error("Unable to save images on Cloudinary!");
            images.push(image);
        };
        review.images = [...review.images, ...images];
        review.description = description.trim();
        review.rating = Number.parseInt(rating);

        //Save review
        const savedReview = await review.save();
        if (!savedReview) throw new Error("Cannot able to save review!");

        //Save averagerating
        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Cannot able to save seller!");

        res.json(new ApiResponse(200, "Review updated successfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Seller details
const fetchSeller = async (req, res) => {
    try {
        //Input validation
        const { sellerId } = req.body;

        if (sellerId == undefined || sellerId.trim() == '') {
            throw new Error("Seller ID required!");
        };

        const seller = await Seller.findById(sellerId.trim()).select(" brandName name email profilePicture address averageRating ");
        if (!seller) throw new Error("Seller does not exists!");

        //Find reviews
        const reviews = await SellerReview.find({ soldBy: seller._id }).populate({
            path: 'madeBy',
            select: " name email profilePicture ",
        }).sort({ updatedBy: -1 });
        if (!reviews) throw new Error("Cannot fetch reviews");

        //Find products
        const products = await Product.aggregate([
            {
                $match: {
                    soldBy: seller._id,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ])
            .catch(error => { throw new Error("Cannot find products related to seller!") });

        //Find order count
        const orderCount = await Order.countDocuments({ soldBy: seller._id });
        if (orderCount == undefined) throw new Error("Cannot fetch order count!!");

        res.json(new ApiResponse(200, "Seller details fetch successfully!", { seller: seller, products: products, reviews: reviews, orderCount: orderCount }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const fetchSellerProducts = async (req, res) => {
    try {
        //Input validation
        const { sellerId, isAvailable, searchBy } = req.body;

        if ([sellerId, searchBy].some((field) => field == undefined || field?.trim() === "")) {
            throw new Error("Required fields are missing!");
        };

        if (isAvailable == undefined) {
            throw new Error("Required fields are missing!");
        };

        let query = {};

        if (isAvailable == true) {
            query = { availability: isAvailable };
        };

        const seller = await Seller.findById(sellerId.trim());
        if (!seller) throw new Error("Cannot find seller!");

        let sortOptions = { createdAt: -1 };

        if (searchBy == 'Recently added') {
            sortOptions = { createdAt: -1 };
        }
        else if (searchBy == 'Price: High to low') {
            sortOptions = { price: -1, createdAt: -1 };
        }
        else if (searchBy == 'Price: Low to high') {
            sortOptions = { price: 1, createdAt: -1 };
        };

        const products = await Product.aggregate([
            {
                $match: {
                    ...query,
                    soldBy: seller._id,
                },
            },
            {
                $sort: sortOptions,
            },
        ])
            .catch(error => { throw new Error("Cannot find products related to seller!") });

        res.json(new ApiResponse(200, "Products fetched succesfully!", products));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const fetchSellerReviews = async (req, res) => {
    try {
        //Input validation
        const { sellerId, searchBy } = req.body;

        if ([sellerId, searchBy].some((field) => field == undefined || field?.trim() === "")) {
            throw new Error("Required fields are missing!");
        };

        const seller = await Seller.findById(sellerId.trim());
        if (!seller) throw new Error("Cannot find seller!");

        let sortOptions = { updatedAt: -1 };

        if (searchBy == 'Recently added') {
            sortOptions = { updatedAt: -1 };
        }
        else if (searchBy == 'Highest rating first') {
            sortOptions = { rating: -1, updatedAt: -1 };
        }
        else if (searchBy == 'Lowest rating first') {
            sortOptions = { rating: 1, updatedAt: -1 };
        };

        const reviews = await SellerReview.aggregate([
            {
                $match: {
                    soldBy: seller._id,
                },
            },
            {
                $sort: sortOptions,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'madeBy',
                    foreignField: '_id',
                    as: 'madeBy',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1, 
                                email: 1, 
                                profilePicture: 1, 
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$madeBy',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .catch(error => { throw new Error("Cannot find reviewss related to seller!") });

        res.json(new ApiResponse(200, "Reviews fetched succesfully!", reviews));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

export {
    //Login-register
    registerUser,
    loginUser,
    logoutUser,

    //Update details
    updateName,
    updateEmail,
    updatePassword,
    updateProfilepicture,
    updateAddress,

    //Wishlist
    addToWishlist,
    removeFromWishlist,
    findWishlist,

    //Cart
    addToCart,
    removeFromCart,
    findCart,

    //Purchase
    orderConfirmation,
    confirmOrder,

    //Orders
    fetchOrders,
    orderDetails,
    changeDeliveryStatus,
    addReview,
    updateReview,
    
    //Seller details
    fetchSeller,
    fetchSellerProducts,
    fetchSellerReviews,
};