import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import options from "../utils/CookiesOptions.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyJWTUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken) throw new Error("No access token!");

        const token = await jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN_SECRET);

        const user = await User.findById(token._id);
        if(!user) throw new Error("Invalid access token!");
        
        req.user = user;
        next();
    } catch (error) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if(!refreshToken) throw new Error("No refresh token!");

            const token = await jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET);

            const user = await User.findById(token._id);
            if(!user) throw new Error("Invalid refresh token!");

            if(refreshToken !== user.refreshToken) throw new Error("Token does not match!");

            const newAccessToken = await user.generateAccessToken()
            .catch(error => { throw new Error("Cannot able to generate new access token!")});

            req.user = user;
            res.cookie("accessToken", newAccessToken, options);
            next();
        } catch (error) {
            res.json(new ApiResponse(400, error.message));
        };
    };
};

export default verifyJWTUser;