import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName:{
     type:String,
     required:true,
     unique:true,
     trim:true,
     lowecase:true,
     minLength:3,
     maxLength:50
    },
    firstName:{
     type:String,
     required:true,
     trim:true,
     minLength:3,
     maxLength:50
    },
    lastName:{
     type:String,
     required:true,
     trim:true,
     minLength:2,
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

 const User = mongoose.model("User" , UserSchema);


 //Account model
 
 
 const AccountSchema = new mongoose.Schema({
     userId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:User,
         required:true
     },
     balance:{
         type:Number,
         required:true
     }
 },{timestamps:true})
 
 const AccountData = mongoose.model("AccountData",AccountSchema);
 

 export {User , AccountData}