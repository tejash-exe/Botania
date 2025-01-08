import mongoose from "mongoose";
import 'dotenv/config';

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to db!");
    }
    catch (error) {
        console.log("Error in connecting to database!", error);
        process.exit(1);
    };
};

export default connectToDb;