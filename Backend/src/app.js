import express from "express"
import cors from "cors"
import { errorHandler } from "./Middlewares/errorHandler.middleware.js"
import cookieParser from "cookie-parser"




// All the middlewares except one.
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser())





/*<<<<<---------------------------------------------------------------------------------------------------------------------------------->>>>>*/
/* imports router from routes.*/
import dummyRouter from "./Routes/dummy.routes.js"
import userRouter from "./Routes/user.routes.js"



/* Sends to appropriate router.*/
app.use("/", dummyRouter)
app.use("/user", userRouter)


/*<<<<<---------------------------------------------------------------------------------------------------------------------------------->>>>>*/




// The last middleware.
app.use(errorHandler)


export { app }