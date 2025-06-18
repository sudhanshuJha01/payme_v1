import { app } from './app.js'
import connectDb from "./db/index.js"
import dotenv from 'dotenv'

dotenv.config({
    path:"./.env"
})
 
const PORT = process.env.PORT

connectDb()
.then(()=>{
    app.listen(PORT || 3000 , ()=>{
        console.log(`our app is running on the port ${PORT || 3000}`);
        console.log("db is connected ... ");
    })
})
.catch((err)=>{
    console.log("Error in the db connection " , err);
})




