import mongoose from "mongoose"


const connectDb = async ()=>{
    try {
       const connectionInstance =  await mongoose.connect(process.env.MOGODB_URI)
       console.log("DB hosted on ", connectionInstance?.connection?.host);
       
    } catch (error) {
            console.log(`Error in the connection with dataBase ${error}` )  
    }
}

export default connectDb





