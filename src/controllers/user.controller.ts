import { User } from "../models/user.model";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";


const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(`Something went wrong: ${error.message}`, 500);
  }
};

const registerUser = asyncHandler(async(req, res)=>{
    const {username, password, fullName, email, age} = req.body;
    if ([username, password, fullName, email, age].some((field)=> field.length === 0)){
        throw new ApiError("Please fill in all fields", 400);
    };

    const existedUser = await User.findOne({$or: [{username}, {email}]});
    if (existedUser) {
        throw new ApiError("User already exists", 409);
    };
    const user = await User.create({username, password, fullName, email, age});
    const newUser: any = await User.findById(user._id).select("-password -refreshToken");
    return res.status(201).json(
        new ApiResponse("User created successfully", newUser, 201)
    );
});

    






export { generateAccessAndRefreshToken, registerUser };