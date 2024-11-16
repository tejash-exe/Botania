import jwt from "jsonwebtoken";
import Seller from "../models/Seller.model.js";
import options from "../utils/CookiesOptions.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyJWTSeller = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken) throw new Error("No access token!");

        const token = await jwt.verify(accessToken, process.env.SELLER_ACCESS_TOKEN_SECRET);

        const seller = await Seller.findById(token._id);
        if(!seller) throw new Error("Invalid access token!");

        req.seller = seller;
        next();
    } catch (error) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if(!refreshToken) throw new Error("No refresh token!");

            const token = await jwt.verify(refreshToken, process.env.SELLER_REFRESH_TOKEN_SECRET);

            const seller = await Seller.findById(token._id);
            if(!seller) throw new Error("Invalid refresh token!");

            if(refreshToken !== seller.refreshToken) throw new Error("Token does not match!");

            const newAccessToken = await seller.generateAccessToken()
            .catch(error => { throw new Error("Cannot able to generate new access token!")});

            req.seller = seller;
            res.cookie("accessToken", newAccessToken, options);
            next();
        } catch (error) {
            res.json(new ApiResponse(400, error.message));
        };
    };
};

export default verifyJWTSeller;