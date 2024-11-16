import Seller from "../models/Seller.model.js";
import Product from "../models/Product.model.js";
import options from "../utils/CookiesOptions.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const generateAccessAndRefreshToken = async (sellerid) => {
    try {
        const seller = await Seller.findById(sellerid);
        if(!seller) throw new Error("Seller not found!");

        const accessToken = await seller.generateAccessToken()
        .catch(error => { throw new Error("Cannot able to generate Access token!")});
        const refreshToken = await seller.generateRefreshToken()
        .catch(error => { throw new Error("Cannot able to generate Refresh token!")});

        seller.refreshToken = refreshToken;
        await seller.save({ validateBeforeSave: false })
        .catch(error => { throw new Error("Cannot able to save Refresh token!")});

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message);
    }
};

const registerSeller = async (req, res) => {
    try {
        const { brandName, name, contactNo, email, password } = req.body;

        if ([brandName, name, contactNo, email, password].some((field) => field?.trim() === "")) {
            throw new Error("Error! Required fields are missing");
        };
        
        const checkSeller = await Seller.findOne({ email: email.trim() });
        if (checkSeller) throw new Error("Error! Seller already exists");

        const savedSeller = await Seller.create(
            {
                brandName: brandName.trim(),
                name: name.trim(),
                contactNo: Number.parseInt(contactNo.trim()),
                email: email.trim(),
                password: password.trim(),
            }
        )
        .catch(error => { throw new Error("Cannot able to create seller!")});

        const seller = await Seller.findById(savedSeller._id).select("-password -refreshToken")
        .catch(error => { throw new Error("Cannot find Seller!")});

        res.json(new ApiResponse(200, "Successfully registered!", seller));
    } catch (error) {
        res.json(new ApiResponse(400, error.message))
    }
};

const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if ([email, password].some((field => field?.trim() === ""))) {
            throw new Error("Error! Required fields are missing");
        };

        const seller = await Seller.findOne({ email: email?.trim() });
        if (!seller) throw new Error("Seller does not exist!");

        if (!seller.isPasswordCorrect(password?.trim())) throw new Error("Invalid password!");

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(seller._id)
        .catch(error => { throw new Error(error.message)});

        const loggedInSeller = await Seller.findById(seller._id).select("-password -refreshToken")
        .catch(error => { throw new Error("Cannot retrieve save info!")});

        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, "Logged in Succesfully!",
                    {
                        seller: loggedInSeller,
                        accessToken,
                        refreshToken
                    }
                )
            );
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
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
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, "Logged out Succesfully!"));


    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const addProducts = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
    
        if([name, description, price, quantity].some(field => field?.trim() === "" )){
            throw new Error("Error! Required fields are missing");
        };

        const coverImagepath = req.file.path;

        const savedCoverImage = await uploadOnCloudinary(coverImagepath);
        if(!savedCoverImage) throw new Error("Unable to save cover image!");
 
        const savedProduct = await Product.create({
            name: name?.trim(),
            description: description?.trim(),
            price: Number.parseFloat(price),
            quantity: Number.parseInt(quantity),
            soldBy: req.seller._id,
            coverImage: savedCoverImage,
        })
        .catch((error) => { throw new Error("Cannot able to create product database!")});

        const product = await Product.findById(savedProduct._id);
        if(!product) throw new Error("Cannot find product!");

        res.json(new ApiResponse(200,"Product saved Succesfully!", product));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const updateProduct = async (req, res) => {
    try {
        const{ productId, name, description, price, quantity } = req.body;
        if (!productId) throw new Error("Invalid product ID");

        if ([name, description, price, quantity].some((field) => field?.trim() === "")) {
            throw new Error("Required fields are missing!");
        };

        const product = await Product.findById(productId);
        if (!product) throw new Error("Product does not exist!");

        const sellerId = req.seller._id;

        if (product.soldBy.toString() !== sellerId.toString()) throw new Error ("Product does not belong to user");
        
        product.name = name.trim();
        product.description = description.trim();
        product.price = Number.parseFloat(price);
        product.quantity = Number.parseInt(quantity);

        const savedProduct = await product.save()
        .catch((error) => { throw new Error("Cannot able to update product!") });

        res.json(new ApiResponse(200, "Product updated Successfully!", savedProduct));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

export {
    registerSeller,
    loginSeller,
    logoutSeller,
    addProducts,
    updateProduct
};