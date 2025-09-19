import express from "express"
import cors from "cors"
import { errorHandler } from "./Middlewares/errorHandler.middleware.js"




// All the middlewares except one.
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))





/*<<<<<---------------------------------------------------------------------------------------------------------------------------------->>>>>*/
/* imports router from routes.*/
import dummyRouter from "./Routes/dummy.routes.js"



/* Sends to appropriate router.*/
app.use("/",dummyRouter)


/*<<<<<---------------------------------------------------------------------------------------------------------------------------------->>>>>*/




// The last middleware.
app.use(errorHandler)


export {app}