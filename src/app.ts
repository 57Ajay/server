import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routs";
import productRouter from "./routes/product.routs";
import type { Request, Response, NextFunction } from 'express';
import ApiResponse from './utils/apiResponse';

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

app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    next();
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler caught:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(
        new ApiResponse(err.message || 'An unexpected error occurred', null, statusCode)
    );
});

app.use(express.static('public'));

app.use(express.json({
    limit: "50mb",
}));


app.use("/api/v1/users", userRouter);

app.use("/api/v1/products", productRouter);


app.use(cookieParser());

export {app};