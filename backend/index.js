import express from 'express';
import rootRouter from './Routes/index.js'
import cors from 'cors';
import dotenv from 'dotenv' 


dotenv.config({
    path:'.env'
})

const app = express();

app.use(express.json());
app.use(cors())


app.use('/api/v1' , rootRouter)


app.listen(3000 , ()=>{
    console.log("our app is running on the port 3000");
    
})