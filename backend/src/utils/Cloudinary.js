import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import 'dotenv/config';
import { error } from "console";

const uploadOnCloudinary = async (localfilepath) => {
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        });

        if (!localfilepath) throw new Error("localfilepath is missing!");

        const response = await cloudinary.uploader.upload(localfilepath, {
            transformation: [
              { quality: 'auto' }, // Auto-optimize quality
              { fetch_format: 'auto' }, // Use modern formats like WebP if supported
            ],
          }).catch(error => {
            console.log(error);
            throw new Error("Unable to upload to cloudinary!");
        });

        console.log("File is uploaded on cloudinary! ", response.url);
        fs.unlinkSync(localfilepath);
        return response.url;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        throw new Error(error);
    };
};

export { uploadOnCloudinary };