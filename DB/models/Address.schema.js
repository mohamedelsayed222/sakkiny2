import { Schema } from "mongoose";

export const AddressSchema = new Schema({
    street: String,
    buildingNumber:Number,
    village:{type:String},
    city: {type:String,required:true},
    country: {type:String,default:'Egypt',required:true},
  });

  export const LocationScema=new Schema({
    type:{type:String,enum: ["Point"],default:'Point'},
    coordinates:[{type:Number,required:true}]
  })
  