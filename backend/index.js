import express, { urlencoded } from 'express';
import rootRouter from './Routes/index.js'
import cors from 'cors';


const app = express();

app.use(cors())
app.use(express.json());
app.use(urlencoded({extended:true}))


app.use('/api/v1' , rootRouter)


app.listen(3000 , ()=>{
    console.log("our app is running on the port 3000");
    
})