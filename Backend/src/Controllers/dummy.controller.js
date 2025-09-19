import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";

const output1 = asyncHandler(async (req,res) => {
    
    // Some codes.

    res
    .json(new ApiResponse(200,{},"Dummy code runs successfully"))
})


const output2 = asyncHandler(async (req,res) => {
     
    // Some codes.

    throw new ApiError(500, "Mission failed successfully")
})





export {output1,output2}