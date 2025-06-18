import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv'       
import userRoute from './Routes/user.routes';
import accountRoute from './Routes/accounts.routes';
import mongoose from "mongoose";

dotenv.config({
    path:"./.env"
})

const app = express();

const PORT = process.env.PORT

app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());


mongoose.connect(process.env.MOGODB_URI)
.then(()=>{
    console.log("database connection succesfull ");
})
.catch(err=>(
    console.log("error in db connection " , err)
))

//routes
app.use('/api/v2' , userRoute)
app.use('/api/v2' , accountRoute)


//test
app.get('/test',(req, res)=>{
    res.json({
        msg:"backend is working well"
    })
})

app.listen(PORT || 3000 , ()=>{
    console.log(`our app is running on the port ${PORT || 3000}`);
})


