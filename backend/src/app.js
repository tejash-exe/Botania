import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: ["https://botania-by-aditya.vercel.app", "https://botania.netlify.app"],
    credentials: true,
}));

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.static("public"));

import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import productRouter from "./routes/product.routes.js";

app.use("/api/users", userRouter);
app.use("/api/sellers", sellerRouter);
app.use("/api/products", productRouter);

export { app };