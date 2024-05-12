import mongoose from 'mongoose'
const connectDB=async()=>{

return await mongoose.connect
(process.env.DB_URL_Cloud)
//  (process.env.DB_URL_Local)
.then
(reult=>{
    console.log('DB CONNECTED....');
}).catch(err=>{
    console.log('catch error',err);
})
}
export default connectDB