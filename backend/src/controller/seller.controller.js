import Order from "../models/Order.model.js";
import Seller from "../models/Seller.model.js";
import Product from "../models/Product.model.js";
import SellerReview from "../models/SellerReview.model.js";
//Utils
import options from "../utils/CookiesOptions.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import {
    razorpayCreateStakeholder,
    razorpayCreateLinkedAccount,
    razorpayRequestRouteconfig,
    razorpayUpdateRouteconfig,
    razorpayFetchRouteconfig,
    razorpayRemoveLinkedAccount,
    razorpayFetchLinkedAccount
} from "../utils/Razorpay.js";

//Generate tokens
const generateAccessAndRefreshToken = async (sellerid) => {
    try {
        const seller = await Seller.findById(sellerid);
        if (!seller) throw new Error("Seller not found!");

        const accessToken = await seller.generateAccessToken();
        const refreshToken = await seller.generateRefreshToken();

        seller.refreshToken = refreshToken;
        const savedSeller = await seller.save({ validateBeforeSave: false })
        if (!savedSeller) throw new Error("Cannot able to save Refresh token!");

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message);
    };
};

//Login-register
const registerSeller = async (req, res) => {
    try {
        //Input validation
        const { name, email, password } = req.body;

        if ([name, email, password].some((field) => field == undefined || field?.trim() === "")) {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^.{0,70}$/.test(name.trim())) throw new Error("Name cannot have more than 70 letters!");

        //Check existing users
        const checkSeller = await Seller.findOne({ email: email.trim() });
        if (checkSeller) throw new Error("Error! Email already exists");

        //Create seller
        const savedSeller = await Seller.create(
            {
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
            },
        );
        if (!savedSeller) throw new Error("Cannot able to create seller!");

        const seller = await Seller.findById(savedSeller._id).select(" email ");
        if (!seller) throw new Error("Cannot find Seller!");

        res.json(new ApiResponse(200, "Successfully registered!", seller));
    } catch (error) {
        res.json(new ApiResponse(400, error.message))
    };
};

const loginSeller = async (req, res) => {
    try {
        //Input validation
        const { email, password } = req.body;

        if ([email, password].some((field => field == undefined || field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        const seller = await Seller.findOne({ email: email?.trim() });
        if (!seller) throw new Error("Seller does not exist!");

        //Check password
        const isPasswordValid = await seller.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        };

        //Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(seller._id);

        const loggedInSeller = await Seller.findById(seller._id);
        if (!loggedInSeller) throw new Error("Cannot find seller!");

        res
            .cookie("selleraccessToken", accessToken, options)
            .cookie("sellerrefreshToken", refreshToken, options)
            .json(new ApiResponse(200, "Logged in Succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const logoutSeller = async (req, res) => {
    try {
        const seller = await Seller.findByIdAndUpdate(req.seller._id,
            {
                $set: {
                    refreshToken: "",
                },
            },
            {
                new: true,
            });
        if (!seller) throw new Error("Cannot find seller!");

        res
            .clearCookie("selleraccessToken", options)
            .clearCookie("sellerrefreshToken", options)
            .json(new ApiResponse(200, "Logged out Succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Update details
const updateBrandname = async (req, res) => {
    try {
        //Input validation
        const { newBrandname } = req.body;

        if (newBrandname == undefined || newBrandname?.trim() === "") {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^.{4,70}$/.test(newBrandname.trim())) throw new Error("Brandname must contain 4 to 70 letters!");

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Seller not found!");

        //Save seller
        seller.brandName = newBrandname?.trim();

        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Error while saving!");

        res.json(new ApiResponse(200, "Brandname changed successfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateName = async (req, res) => {
    try {
        //Input validation
        const { newName } = req.body;

        if (newName == undefined || newName?.trim() === "") {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^.{0,70}$/.test(newName.trim())) throw new Error("Name cannot have more than 70 letters!");

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Seller not found!");

        //Save seller
        seller.name = newName?.trim();

        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Error while saving!");

        res.json(new ApiResponse(200, "Name changed successfully!"));
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

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Seller not found!");

        //Check existing user
        const existedSeller = await Seller.findOne({ email: newEmail });
        if (existedSeller) throw new Error("Email already exists!");

        //Check password
        const isPasswordValid = await seller.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        };

        seller.email = newEmail?.trim();

        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Error while saving!");

        res.json(new ApiResponse(200, "Email no. changed successfully!"));
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

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Seller not found!");

        //Check password
        const isPasswordValid = await seller.isPasswordCorrect(password?.trim());
        if (!isPasswordValid) {
            throw new Error("Invalid password!");
        };

        //Save seller
        seller.password = newPassword?.trim();

        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Error while saving!");

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

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannt find seller!");

        const profilePictureUrl = await uploadOnCloudinary(profilePicturePath);
        if (!profilePictureUrl) throw new Error("Cannot able to upload!");

        //Save seller
        seller.profilePicture = profilePictureUrl;

        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Error while saving!");

        res.json(new ApiResponse(200, "Profile picture updated successfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateAddress = async (req, res) => {
    try {
        //Input validation
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

        //Save seller
        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Seller does not exist!");

        seller.address = {
            localAddress: localAddress.trim(),
            landmark: landmark?.trim() || "",
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            contact: contact.trim(),
        };

        const savedSeller = await seller.save();
        if (!savedSeller) throw new Error("Cannot save address!");

        res.json(new ApiResponse(200, "Address updated succesfully!"));
    } catch (error) {
        res.status(400).json(new ApiResponse(400, error.message));
    };
};

//Fetch details
const fetchProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id).select("-refreshToken -password").lean();
        if (!seller) throw new Error("Cannot find Seller!");

        //Fetch orders
        const orderCount = await Order.countDocuments({ soldBy: seller._id });
        if (orderCount == undefined) throw new Error("Cannot fetch order count!!");

        res.json(new ApiResponse(200, "Profile fetched Successfully!", { seller: seller, orderCount: orderCount }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const fetchAddress = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id).lean();
        if (!seller) throw new Error("Cannot find Seller!");

        res.json(new ApiResponse(200, "Address fetched Successfully!", seller.address));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Link to razorpay
const fetchRazorpay = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id).select(" razorpay  ").lean();
        if (!seller) throw new Error("Cannot find Seller!");

        res.json(new ApiResponse(200, "Razorpay details fetched succesfully!", seller));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const createLinkedAccount = async (req, res) => {
    try {
        //Input validation
        const { email } = req.body;
        if (email == undefined || email.trim() === '') {
            throw new Error("Error! Required fields are missing!");
        };

        if (!email.endsWith("@botania.com")) throw new Error("Email does not ends with '@botania.com'!");

        //Check existing email
        const existedEmail = await Seller.findOne({ "razorpay.email": email });
        if (existedEmail) throw new Error("Email already exists!");

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Check requirements
        if (seller.brandName == "") throw new Error("Have a Brandname first!");

        if (seller.address.pincode == "111111") throw new Error("Have an Address first!");

        if (seller.razorpay.accountId !== "") throw new Error("Seller already has Linked Account!");

        //Create linked account
        const result = await razorpayCreateLinkedAccount(seller, email.trim());

        //Save seller
        seller.razorpay.email = email.trim();
        seller.razorpay.accountId = result.id;
        seller.razorpay.beneficiary_name = result.legal_business_name;

        const savedSeller = await seller.save();
        if (!savedSeller) {
            throw new Error("Cannot able to save user! But linked account is created with an ID - " + result.id + " and email ID - " + email.trim());
        };

        res.json(new ApiResponse(200, "Linked account created Succesfully!", { email: email.trim(), accountId: result.id }));
    } catch (error) {
        if (error.message === 'Merchant email already exists for account - PN2Mj6lHxZkm9n') {
            res.json(new ApiResponse(400, 'Email already exists!'));
        }
        else {
            res.json(new ApiResponse(400, error.message));
        };
    };
};

const createStakeholder = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Check requirements
        if (seller.razorpay.stakeholderId !== "") throw new Error("StakeholderID already exists for Seller!");

        if (seller.razorpay.accountId == undefined || seller.razorpay.accountId === "") {
            throw new Error("Error! First have a linked accountID for Razorpay!");
        };

        //Create stakeholder
        const response = await razorpayCreateStakeholder(seller);
        //Save seller
        seller.razorpay.stakeholderId = response.id;

        const savedSeller = await seller.save();
        if (!savedSeller) {
            throw new Error("Cannot able to save user! But stakeholder is created with an ID - " + response.id);
        };

        res.json(new ApiResponse(200, "Stakeholder created succesfully!", { stakeholderId: response.id }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const requestRouteConfig = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Check requirements
        if (seller.razorpay.routeconfigId !== "") throw new Error("Route config ID already exists for Seller!");

        if (seller.razorpay.accountId == undefined || seller.razorpay.accountId === "") {
            throw new Error("Error! First have a Linked Account for Razorpay!");
        };

        if (seller.razorpay.stakeholderId == undefined || seller.razorpay.stakeholderId === "") {
            throw new Error("Error! First become a stakeholder for Razorpay!");
        };

        //Request route config
        const response = await razorpayRequestRouteconfig(seller);

        //Save seller
        seller.razorpay.routeconfigId = response.id;
        seller.razorpay.activationStatus = response.activation_status;
        const savedSeller = await seller.save();
        if (!savedSeller) {
            throw new Error("Cannot able to save user! But route is configured with an ID - " + response.id);
        };

        res.json(new ApiResponse(200, "Route configured succesfully!", { routeconfigId: response.id, activationStatus: response.activation_status }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateRouteConfig = async (req, res) => {
    try {
        //Input validation
        const { acc_no, ifsc_code } = req.body;

        if ([acc_no, ifsc_code].some((field => field == undefined || field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Check requirements
        if (seller.razorpay.accountId == undefined || seller.razorpay.accountId === "") {
            throw new Error("Error! First have a Linked Account for Razorpay!");
        };

        if (seller.razorpay.stakeholderId == undefined || seller.razorpay.stakeholderId === "") {
            throw new Error("Error! First become a stakeholder for Razorpay!");
        };

        if (seller.razorpay.routeconfigId == undefined || seller.razorpay.routeconfigId === "") {
            throw new Error("Error! First have a routeconfig ID for Razorpay!");
        };

        if (seller.razorpay.beneficiary_name == undefined || seller.razorpay.beneficiary_name === "") {
            throw new Error("Error! First have a linked account with brandname for Razorpay!");
        };

        //Update route config
        const response = await razorpayUpdateRouteconfig(seller, acc_no.trim(), ifsc_code.trim(), seller.razorpay.beneficiary_name);

        //Save seller
        seller.razorpay.account_number = acc_no.trim();
        seller.razorpay.ifsc_code = ifsc_code.trim();
        seller.razorpay.activationStatus = response.activation_status;

        const savedSeller = await seller.save();
        if (!savedSeller) {
            throw new Error("Cannot able to save user! But activation status is " + response.activation_status);
        };

        res.json(new ApiResponse(200, "Route updated succesfully!", {
            beneficiary_name: seller.razorpay.beneficiary_name.trim(),
            acc_no: acc_no.trim(),
            ifsc_code: ifsc_code.trim(),
            activationStatus: response.activation_status,
        }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const refreshRouteConfig = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Check requirements
        if (seller.razorpay.accountId == undefined || seller.razorpay.accountId === "") {
            throw new Error("Error! First have a Linked Account for Razorpay!");
        };

        if (seller.razorpay.stakeholderId == undefined || seller.razorpay.stakeholderId === "") {
            throw new Error("Error! First become a stakeholder for Razorpay!");
        };

        if (seller.razorpay.routeconfigId == undefined || seller.razorpay.routeconfigId === "") {
            throw new Error("Error! First have a routeconfig ID for Razorpay!");
        };

        //Fetch route config
        const response = await razorpayFetchRouteconfig(seller);
        seller.razorpay.activationStatus = response.activation_status;

        //Save seller
        const savedSeller = await seller.save();
        if (!savedSeller) {
            throw new Error("Cannot able to save user! But activation status is " + response.activation_status);
        };

        res.json(new ApiResponse(200, "Route updated succesfully!", {
            activationStatus: response.activation_status
        }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const deleteLinkedAccount = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Try deleting linked account
        const response = await razorpayRemoveLinkedAccount(seller.razorpay.accountId);

        //Save seller
        seller.razorpay.email = undefined;
        seller.razorpay.accountId = "";
        seller.razorpay.stakeholderId = "";
        seller.razorpay.routeconfigId = "";
        seller.razorpay.activationStatus = "";
        seller.razorpay.account_number = "";
        seller.razorpay.beneficiary_name = "";
        seller.razorpay.ifsc_code = "";
        seller.activated = false;

        const savedSeller = await seller.save();
        if (!savedSeller) {
            throw new Error("Cannot able to save user!");
        };

        res.json(new ApiResponse(200, "Linked account deleted succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Account activation
const requestAccountActivation = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller!");

        //Check requirements
        if (seller.brandName === "") throw new Error("Enter a Brandname first!");

        if (seller.address.pincode === "111111") throw new Error("Add your address first!");

        if (seller.razorpay.accountId === "") throw new Error("Link your account to razorpay first!");

        //Check razorpay activation status
        const response = await razorpayFetchRouteconfig(seller);

        if (response.activation_status !== 'activated') {
            seller.razorpay.activationStatus = response.activation_status;
            const savedSeller = await seller.save()
            if (!savedSeller) throw new Error("Cannot able to save user!!");
            throw new Error("Link your account to razorpay first!");
        };

        //Save seller
        seller.activated = true;

        const savedSeller = await seller.save()
        if (!savedSeller) throw new Error("Cannot able to save user!");

        res.json(new ApiResponse(200, "Account activated succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Products
const fetchProducts = async (req, res) => {
    try {
        //Input validation
        const { isAvailable } = req.body;

        if (isAvailable == undefined) {
            throw new Error("Required field is missing!");
        };

        let query = {};

        if (isAvailable == true) {
            query = { availability: isAvailable };
        };

        const seller = await Seller.findById(req.seller._id).select("-refreshToken -password").lean();
        if (!seller) throw new Error("Cannot find Seller!");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Error! Account is not activated!!"));
            return;
        };

        const products = await Product.aggregate([
            {
                $match: {
                    ...query,
                    soldBy: seller._id,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);
        if (!products) throw new Error("Cannot find products related to seller!");

        res.json(new ApiResponse(200, "Products fetched Successfully!", products));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const addProduct = async (req, res) => {
    try {
        //Input validation
        const { name, description, price } = req.body;

        if ([name, description, price].some(field => field?.trim() === "")) {
            throw new Error("Error! Required fields are missing");
        };

        if (!/^.{0,70}$/.test(name.trim())) throw new Error("Name cannot have more than 70 letters!");

        if (!/^[\s\S]{0,1000}$/.test(description.trim())) throw new Error("Description cannot have more than 1000 letters!");

        if (Number.parseFloat(price.trim()) > 5000 || Number.parseFloat(price.trim()) < 0) {
            throw new Error("Price must be between Rs.0 and Rs.5000!!");
        };

        const findSeller = await Seller.findById(req.seller._id)
        if (!findSeller) throw new Error("Cannot find seller!");

        //Check activation status
        if (findSeller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const imageFiles = req.files;

        if (!imageFiles || imageFiles.length == 0) {
            throw new Error("No images uploaded!");
        };

        const filepaths = imageFiles.map((images) => images.path);

        const images = [];
        for (const paths of filepaths) {
            const image = await uploadOnCloudinary(paths);
            if (!image) throw new Error("Unable to save images on Cloudinary!");
            images.push(image);
        };

        //Create products
        const savedProduct = await Product.create({
            name: name?.trim(),
            description: description?.trim(),
            price: Number.parseFloat(price.trim()),
            soldBy: findSeller._id,
            images: images,
        });
        if (!savedProduct) throw new Error("Cannot able to create product database!");

        const product = await Product.findById(savedProduct._id);
        if (!product) throw new Error("Cannot find product!");

        //Save seller
        findSeller.products.unshift(product._id);

        const savedSeller = await findSeller.save();
        if (!savedSeller) throw new Error("Cannot able to save user!");

        res.json(new ApiResponse(200, "Product saved Succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const fetchProductdetails = async (req, res) => {
    try {
        //Input validation
        const productId = req.params?.productId;

        if (productId == undefined || productId === '') {
            throw new Error("Product ID is missing!");
        };

        const seller = await Seller.findById(req.seller._id).select("activated name brandName profilePicture averageRating address").lean();
        if (!seller) throw new Error("Cannot find Seller!");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const product = await Product.findById(productId).lean();
        if (!product) throw new Error("Product does not exists!");

        const sellerId = seller._id;

        //Check if product belongs to seller
        if (product.soldBy.toString() !== sellerId.toString()) throw new Error("Product does not belong to seller");

        res.json(new ApiResponse(200, "Product fetched Successfully!", { seller: seller, product: product }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const fetchProducttoUpdate = async (req, res) => {
    try {
        //Input validation
        const productId = req.params?.productId;

        if (productId == undefined || productId === '') {
            throw new Error("Product ID is missing!");
        };

        const seller = await Seller.findById(req.seller._id).select("activated name brandName averageRating address profilePicture").lean();
        if (!seller) throw new Error("Cannot find Seller!");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const product = await Product.findById(productId).lean();
        if (!product) throw new Error("Product does not exists!");

        //Check product availibility
        if (product.availability == false) {
            res.json(new ApiResponse(467, "Cannot update sold products!!"));
            return;
        };

        const sellerId = seller._id;

        //Check if product belongs to seller
        if (product.soldBy.toString() !== sellerId.toString()) throw new Error("Product does not belong to seller");

        res.json(new ApiResponse(200, "Product fetched Successfully!", { seller: seller, product: product }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const setAvailabilityFalse = async (req, res) => {
    try {
        //Input validation
        const { productId } = req.body;
        if (!productId) throw new Error("Invalid product ID!");

        const seller = await Seller.findById(req.seller._id)
        if (!seller) throw new Error("Cannot find seller!");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const product = await Product.findById(productId);
        if (!product) throw new Error("Product does not exist!");

        if (product.availability == false) console.log("Product already unavailable!!");

        const sellerId = seller._id;

        //Check if product belongs to seller
        if (product.soldBy.toString() !== sellerId.toString()) throw new Error("Product does not belong to seller");

        product.availability = false;

        //Save product
        const savedProduct = await product.save();
        if (!savedProduct) throw new Error("Cannot able to save!");

        res.json(new ApiResponse(200, "Product made unavailable succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const updateProduct = async (req, res) => {
    try {
        //Input validation
        const { productId, name, description, price, deleted } = req.body;
        if (!productId) throw new Error("Invalid product ID!");

        if ([name, description, price, deleted].some((field) => field?.trim() === "")) {
            throw new Error("Required fields are missing!");
        };

        if (!/^.{0,70}$/.test(name.trim())) throw new Error("Name cannot have more than 70 letters!");

        if (!/^[\s\S]{0,1000}$/.test(description.trim())) throw new Error("Description cannot have more than 1000 letters!");

        if (Number.parseFloat(price.trim()) > 5000 || Number.parseFloat(price.trim()) < 0) {
            throw new Error("Price must be between Rs.0 and Rs.5000!!");
        };

        const seller = await Seller.findById(req.seller._id)
        if (!seller) throw new Error("Cannot find seller!");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const product = await Product.findById(productId);
        if (!product) throw new Error("Product does not exist!");

        //Check product's availibility
        if (product.availability == false) {
            res.json(new ApiResponse(467, "Cannot update sold products!!"));
            return;
        };

        const sellerId = seller._id;

        //Check if product belongs to seller
        if (product.soldBy.toString() !== sellerId.toString()) throw new Error("Product does not belong to seller");

        const toDelete = Number.parseInt(deleted.trim());
        if (toDelete > 0) {
            if (product.images.length < toDelete) {
                throw new Error("Cannot delete more images than exist in the product!!");
            };
            product.images = product.images.slice(0, -toDelete);
        };

        const imageFiles = req.files;

        const filepaths = imageFiles.map((images) => images.path);

        const images = [];
        for (const paths of filepaths) {
            const image = await uploadOnCloudinary(paths);
            if (!image) throw new Error("Unable to save images on Cloudinary!");
            images.push(image);
        };

        product.images = [...product.images, ...images];
        product.name = name.trim();
        product.description = description.trim();
        product.price = Number.parseFloat(price.trim());

        //Save product
        const savedProduct = await product.save();
        if (!savedProduct) throw new Error("Cannot able to update product!");

        res.json(new ApiResponse(200, "Product updated Successfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Orders
const fetchOrders = async (req, res) => {
    try {
        //Input validation
        const { filterBy } = req.body;
        if (filterBy == undefined || filterBy.trim() == "") throw new Error("FilterBy is missing!");

        let query = {};

        if (filterBy == 'Ready to ship') {
            query = { deliveryStatus: 'Packing' };
        };

        if (filterBy == 'Shipped') {
            query = { deliveryStatus: 'Shipped' };
        };

        if (filterBy == 'Delivered') {
            query = { deliveryStatus: 'Delivered' };
        };

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const orders = await Order.aggregate([
            {
                $match: {
                    ...query,
                    soldBy: req.seller._id,
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
        if (!orders) throw new Error("Cannot able to fetch order!");

        res.json(new ApiResponse(200, "Orders fetched succesfully!", orders));
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
            path: 'boughtBy',
            select: ' name email profilePicture ',
        }).lean();
        if (!order) throw new Error("Order does not exists!!");

        //Check if order is related to seller
        if (order.soldBy._id.toString() !== req.seller._id.toString()) throw new Error("Order details does not belong to seller!!");

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const review = await SellerReview.findOne({ order: orderId });
        if (!review) {
            res.json(new ApiResponse(200, "Order details fetched successfully!", { order: order }));
            return;
        };

        res.json(new ApiResponse(201, "Order details with review fetched successfully!", { order: order, review: review }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const changeDeliveryStatus = async (req, res) => {
    try {
        //Input validation
        const { orderId } = req.body;
        if (orderId == undefined || orderId.trim() == "") throw new Error("Required field is empty!!");

        const order = await Order.findById(orderId);
        if (!order) throw new Error("Cannot fetch order details");

        //Check order is related to user
        if (order.soldBy._id.toString() !== req.seller._id.toString()) throw new Error("Order details does not belong to seller!!");

        //Check delivery status
        if (order.deliveryStatus !== 'Packing') throw new Error("You can only ship your order when the order status is packing!!");

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        //Save order 
        order.deliveryStatus = 'Shipped';
        order.shippedOn = Date.now();

        const saving = await order.save();
        if (!saving) throw new Error("Cannot able to save order details!");

        res.json(new ApiResponse(200, "Order updated succesfully!!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

//Reviews
const fetchReviews = async (req, res) => {
    try {
        //Input validation
        const { searchBy } = req.body;

        if (searchBy == undefined || searchBy.trim() == '') throw new Error("SearchBy field is required!");

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

        const seller = await Seller.findById(req.seller._id);
        if (!seller) throw new Error("Cannot find seller");

        //Check activation status
        if (seller.activated == false) {
            res.json(new ApiResponse(468, "Account not activated!"));
            return;
        };

        const reviews = await SellerReview.aggregate([
            {
                $match: {
                    soldBy: req.seller._id,
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
        if (!reviews) throw new Error("Cannot find reviewss related to seller!");

        res.json(new ApiResponse(200, "Reviews fetched succesfully!", reviews));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

export {
    //Login-register
    registerSeller,
    loginSeller,
    logoutSeller,

    //Update details
    updateBrandname,
    updateName,
    updateEmail,
    updatePassword,
    updateProfilepicture,
    updateAddress,

    //Fetch details
    fetchProfile,
    fetchAddress,

    //Link to razorpay
    fetchRazorpay,
    createLinkedAccount,
    createStakeholder,
    requestRouteConfig,
    updateRouteConfig,
    refreshRouteConfig,
    deleteLinkedAccount,
    requestAccountActivation,

    //Products
    fetchProducts,
    addProduct,
    fetchProductdetails,
    fetchProducttoUpdate,
    setAvailabilityFalse,
    updateProduct,

    //Orders
    fetchOrders,
    orderDetails,
    changeDeliveryStatus,

    //Reviews
    fetchReviews,
};