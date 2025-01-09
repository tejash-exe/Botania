import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import 'dotenv/config';
import sharp from "sharp";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) throw new Error("localfilepath is missing!");

        const fileSize = fs.statSync(localfilepath).size; // File size in bytes
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

        // Compress image if it exceeds 10 MB
        if (fileSize > maxSize) {
            console.log("Compressing image...");
            const compressedFilePath = `compressed-${Date.now()}.jpg`;

            await sharp(localfilepath)
                .jpeg({ quality: 80 })  // Compress to 80% quality
                .toFile(compressedFilePath);

            // Replace the original file with the compressed file
            fs.unlinkSync(localfilepath);
            localfilepath = compressedFilePath;

            console.log("Image compressed successfully.");
        };

        const response = await cloudinary.uploader.upload(localfilepath)
        .catch(error => {
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