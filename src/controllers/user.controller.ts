import { User } from "../models/user.model";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";


const generateAccessAndRefreshToken = async (userId: any) => {
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

const getUserByUsername = asyncHandler(async (req, res, next) => {
    const { username } = req.params;
    console.log('Searching for username:', username);

    const user = await User.findOne({ username }).select('-password -refreshToken');
    console.log('Database query result:', user);

    if (!user) {
        console.log('User not found in database');
        throw new ApiError("User not found", 404);
    };

    console.log('User found, sending response');
    res.status(200).json(new ApiResponse("User found", user, 200));
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { username, password, email } = req.body;
    if ((!username && !email) || !password) {
        throw new ApiError("Please provide either username or email, and password", 400);
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const passwordMatched = await user.isPasswordMatched(password);
    if (!passwordMatched) {
        throw new ApiError("Invalid password", 401);
    }
    
    try {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true, 
            maxAge: 1000 * 60 * 60 * 24, // 1 days
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        }).json(
            new ApiResponse("Login successful", { user: loggedInUser }, 200)
        );
    } catch (error) {
        throw new ApiError("Error generating tokens", 500);
    };
});

const logOutUser = asyncHandler(async(req, res, next)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1 // removes the field from the document
            }
        },
        {
            new: true,
        }
    );
    return res.status(200).clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
    }).clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    }).json(
        new ApiResponse("Logout successful", null, 200)
    );
});

const updatePassword = asyncHandler(async(req, res)=>{
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new ApiError("Please provide current password and new password", 400);
    };
    console.log("req.user:> ",req.user);
    const user = await User.findById(req.user?._id);
    console.log("User:> ",user);
    if (!user) {
        throw new ApiError("User not found", 404);
    };

    user.password = newPassword;
    await user.save({validateBeforeSave: false});
    return res.status(200).json(
        new ApiResponse("Password updated successfully", null, 200)
    );

});

const updateEmail = asyncHandler(async(req, res)=>{
    const { currentEmail, newEmail } = req.body;
    if (!currentEmail || !newEmail) {
        throw new ApiError("Please provide current email and new email", 400);
    };
    if(currentEmail === newEmail){
        throw new ApiError("New email cannot be the same as current email", 400);
    };
    
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError("User not found", 404);
    };
    user.email = newEmail;
    await user.save({validateBeforeSave: false});
    return res.status(200).json(
        new ApiResponse("Email updated successfully", null, 200)
    );
});



export { generateAccessAndRefreshToken, registerUser, getUserByUsername, loginUser, logOutUser, updatePassword, updateEmail };