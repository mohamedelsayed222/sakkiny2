import { Schema } from "mongoose";

export const LocationSchema=new Schema({
        latitude:{type:Number ,required:true},
        longtitude:{type:Number, required:true},
        address:{type:String},
        addressName:{type:String},
})