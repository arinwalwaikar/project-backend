import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import {uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    // get user details from frontend 
    const {fullName,email,username,password}=req.body;
    console.log("email",email);
    
    // valiadation - not empty
    if(
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ){
       throw new ApiError(400,"All fields are required");
    }
    
    // check if user exists : username,email
    const existingUser = User.findOne({
        $or : [{ username },{ email }]
    })
    if(existingUser){
        throw new ApiError(409,"User already exists with this username or email");
    }
    
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image is required");
    }

    // upload them to cloudinary, avatar 
    const avatar = await uploadOnCloudinary(avatarLocalPath); 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar = avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username = username.toLowerCase()
    })

    // remove password and refresh token from field
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    // return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
})

export { registerUser } 