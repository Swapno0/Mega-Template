import { pool } from "../index.js";
import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req,res,next) => {
    // take token from cookies of the browser
    const token = req.cookies?.token

    // validate required token
    if(!token) throw new ApiError(401,"Unauthorized request")

    // decode token
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    // check user
    const sql = `SELECT USERNAME,EMAIL,AVATAR FROM schema_name.table_name
                WHERE USERNAME = $1`
    const parameters = [decodedToken.userName]
    const checkUser = await pool.query(sql,parameters)

    // validate user
    if(checkUser.rows.length == 0) throw new ApiError(401,"Invalid Access Token")

    // what to do next
    req.user = checkUser.rows
    next()
})