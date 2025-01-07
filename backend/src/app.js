import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// app.use(cors({
//     origin: "*",
//     optionsSuccessStatus: 200,
//     credentials: true,
// }));

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