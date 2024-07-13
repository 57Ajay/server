import type { IUser, IUserMethods, UserModel } from "../models/user.model";
class ApiResponse{
    message: string;
    data: IUser | UserModel | IUserMethods | null;
    statuscode: number;
    success: boolean;
    constructor(
        message = "successful",
        data: IUser | UserModel| IUserMethods | null,
        statuscode: number,
    ){
        this.message = message;
        this.data = data;
        this.statuscode = statuscode;
        this.success = statuscode < 400;
    }
};

export default ApiResponse;