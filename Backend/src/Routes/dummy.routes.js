import {Router} from "express"
import { output1, output2 } from "../Controllers/dummy.controller.js"



const router = Router()


/* Route for dummy api 1*/
router.get('/dummy1',output1)


/* Route for dummy api 2*/
router.get('/dummy2',output2)






export default router