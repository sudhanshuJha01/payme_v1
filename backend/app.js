import express from 'express';
import rootRouter from './Routes/index.js'

import cors from 'cors';

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({extended:true , limit:"16kb"}))


//routes

app.use('/api/v1' , rootRouter)




//test
app.get('/',(req, res)=>{
    res.json({
        msg:"backend is working well"
    })
})


export {app}