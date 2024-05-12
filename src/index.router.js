import connectDB from "../DB/connection.js";
import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import propertyRouter from './modules/property/proprty.router.js'
import hostingRouter from './modules/hosting/hosting.router.js'
import { globalErrorHandling } from "./utils/errorHandling.js";
// import cors from 'cors'


const bootstrap=(app,express)=>{
    app.use(express.json())
    connectDB();
    // app.use(cors())
    app.get('/',(req,res)=>{
        res.send("Welcome to Sakkiny")
    })
    app.use('/user',userRouter)
    app.use('/auth',authRouter)
    app.use('/property',propertyRouter)
    app.use('/hosting',hostingRouter)
    app.use(globalErrorHandling)
}

export default bootstrap;