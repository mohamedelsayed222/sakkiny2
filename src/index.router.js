import connectDB from "../DB/connection.js";
import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import propertyRouter from './modules/property/proprty.router.js'
import identityRouter from './modules/identity/identity.router.js'
import hostingRouter from './modules/hosting/hosting.router.js'
import adminRouter from './modules/Admin Dashboard/admin.router.js'
import serviceRouter from './modules/mintainance/service.router.js'
import { globalErrorHandling } from "./utils/errorHandling.js";
import bodyParser from 'body-parser';
import cors from 'cors'


const bootstrap=(app,express)=>{
    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: true })); 
    connectDB();
    app.use(cors())
    app.get('/',(req,res)=>{
        res.send("Welcome to Sakkiny")
    })
    app.use('/user',userRouter)
    app.use('/auth',authRouter)
    app.use('/property',propertyRouter)
    app.use('/identity',identityRouter) 
    app.use('/hosting',hostingRouter)
    app.use('/service',serviceRouter)
    app.use('/admin',adminRouter)


    app.use(globalErrorHandling)
}

export default bootstrap;