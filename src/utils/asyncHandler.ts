import type { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: (arg0: Request, arg1: Response, arg2: NextFunction) => any)=>{
    return  (req: Request, res: Response, next: NextFunction)=>{
        Promise.resolve(fn(req, res, next)).catch((err)=> next(err))
    } 
};

export default asyncHandler;