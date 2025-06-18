import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
     type:String,
     required:true,
     unique:[true,"email should be unique"],
     trim:true,
     lowecase:[true,"email should be in lower case"],
     minLength:3,
     maxLength:50
    },
    fullname:{
     type:String,
     required:true,
     trim:true,
     minLength:3,
     maxLength:50
    },
    password:{
     type:String,
     required:true,
     trim:true,
     minLength:6,
     maxLength:50
    }
 },{timestamps:true});

export const User = mongoose.model("User" , UserSchema)
 
 