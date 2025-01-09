import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import 'dotenv/config';
import sharp from "sharp";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const compressImageUntilSize = async (filePath, targetSize) => {
    let quality = 90; // Start with high quality
    let compressedFilePath = `compressed-${Date.now()}.jpg`;

    while (true) {
        await sharp(filePath)
            .jpeg({ quality }) // Reduce quality
            .toFile(compressedFilePath);

        const fileSize = fs.statSync(compressedFilePath).size; // File size in bytes
        if (fileSize <= targetSize || quality <= 10) {
            // Stop if the file size is within the limit or quality is too low
            break;
        }

        // Decrease quality for the next iteration
        quality -= 10;

        // Remove the previous compressed file to save space
        fs.unlinkSync(compressedFilePath);
    };

    return compressedFilePath;
};

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) throw new Error("localfilepath is missing!");

        const fileSize = fs.statSync(localfilepath).size; // File size in bytes
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

        // Compress image until it is smaller than 10 MB
        if (fileSize > maxSize) {
            console.log("Compressing image...");
            localfilepath = await compressImageUntilSize(localfilepath, maxSize);
            console.log("Image compressed successfully.");
        }

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