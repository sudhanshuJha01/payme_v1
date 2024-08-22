import express from 'express';
import rootRouter from './Routes/index.js'
// const cors = require('cors');
import cors from 'cors';


const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());
// app.use(urlencoded({extended:true}))


app.use('/api/v1' , rootRouter)


app.listen(3000 , ()=>{
    console.log("our app is running on the port 3000");
    
})