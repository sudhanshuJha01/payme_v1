import { app } from './app.js'
import connectDb from "./db/index.js"

import dotenv from 'dotenv'
dotenv.config({
    path:"./.env"
})
 



console.log(process.env.MOGODB_URI )
console.log(process.env.JWT_SECRET );


connectDb()
.then(()=>{
    app.listen(process.env.PORT || 3000 , ()=>{
        console.log(`our app is running on the port ${process.env.PORT || 3000}`);
        
    })
})
.catch((err)=>{
    console.log("Error in the db connection " , err);
    
})




