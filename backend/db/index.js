import mongoose from "mongoose";

try {
    mongoose.connect(`${process.env.MONGODB_URI}/onlinePaymentDatabase`)
} catch (error) {
        console.log(`Error in the connection with dataBase ${error}` );
        
}

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


export {User}
