import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routs";
import productRouter from "./routes/product.routs";

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
));

app.use(express.urlencoded({
    extended: true,
    limit: '50kb'
}));

app.use(express.static('public'));

app.use(express.json({
    limit: "50mb",
}));

app.use("/api/v1/users", userRouter);

app.use("/api/v1/products", productRouter);


app.use(cookieParser());

export {app};