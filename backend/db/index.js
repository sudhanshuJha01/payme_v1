import mongoose from "mongoose"


const connectDb = async ()=>{
    try {
        mongoose.connect(`${process.env.MOGODB_URI}/paymetApp`)
    
    } catch (error) {
            console.log(`Error in the connection with dataBase ${error}` )
            
    }
}

export default connectDb





