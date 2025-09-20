import { pool } from "../index.js";
import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { uploader } from "../Utils/Cloudinary.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ApiResponse } from "../Utils/ApiResponse.js";



const generateAccessToken = function(userName) {
    return jwt.sign(
        {
            userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}




const registerUser = asyncHandler(async (req,res) => {
    // take data from frontend
    const {userName,email,password} = req.body

    // validate required field
    if (userName === "" || userName.length > 15) throw new ApiError(400,"Username is required")
    if (email === "") throw new ApiError(400,"Email is required")
    if (password === "") throw new ApiError(400,"Password is required")
    
    // check existed user
    const sql = `SELECT * FROM schema_name.table_name
                WHERE USERNAME = $1`
    const parameters = [userName]
    const existedUser = await pool.query(sql,parameters)
    if (existedUser.rows.length != 0) throw new ApiError(409,"An user already exists with the same USERNAME")

    // take files (avatar,coverphoto etc)
    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) throw new ApiError(400,"Avatar is required")

    // upload the files to cloudinary
    const avatar = await uploader(avatarLocalPath)

    // encrypt password
    const hashPassword = await bcrypt.hash(password,6)

    // save user to database SCHEMA.
    const sql2 = `INSERT INTO schema_name.table_name
                VALUES($1,$2,$3,$4,$5,DEFAULT)`
    const parameters2 = [use_a_sequence,userName,email,avatar.url,hashPassword]
    const user = await pool.query(sql2,parameters2)
    

    // check whether user was saved or not

    // generate token

    // send token to cookie
    res.json(new ApiResponse(200,user.rows,"User registered successfully"))
})



const loginUser = asyncHandler(async (req,res) => {
    // take data from frontend
    const {userName,password} = req.body

    // validate required field
    if (userName === "") throw new ApiError(400,"Username is required")
    if (password === "") throw new ApiError(400,"Username is required")

    // check user
    const sql = `SELECT * FROM schema_name.table_name
                WHERE USERNAME = $1`
    const parameters = [userName]
    const existedUser = await pool.query(sql,parameters)
    if (existedUser.rows.length == 0) throw new ApiError(409,"User does not exist")

    // check password
    const isPasswordValid = await bcrypt.compare(password,existedUser.rows[0].password)
    if (!isPasswordValid) throw new ApiError(401,"Invalid User Credentials")

    // bring data of user without some columns
    const sql2 = `SELECT USERNAME,EMAIL,BIO,AVATAR FROM schema_name.table_name
                WHERE USERNAME = $1`
    const parameters2 = [userName]
    const loggedInUser = await pool.query(sql2,parameters2)
    

    // generate token
    const token = generateAccessToken(userName)
    const options = {
        httpOnly: true,
        secure: true
    }

    // send token to cookie
    res
    .cookie("token",token,options)
    .json(new ApiResponse(200,loggedInUser,"User logged in successfully"))
})




const logoutUser = asyncHandler(async (req,res) => {
    // clear the cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .clearCookie("token",options)
    .json(new ApiResponse(200,{},"User logged out"))

})





export {registerUser,loginUser,logoutUser}