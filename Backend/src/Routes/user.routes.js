import {Router} from "express"
import { loginUser, logoutUser, registerUser } from "../Controllers/user.controller.js"
import { verifyJWT } from "../Middlewares/auth.middleware.js"



const router = Router()


/* Route for register*/
router.post('/register',registerUser)


/* Route for login*/
router.post('/login',loginUser)


/* Route for logout*/
router.post('/logout', verifyJWT, logoutUser)






export default router