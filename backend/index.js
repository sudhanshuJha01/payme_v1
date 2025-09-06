import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './Routes/user.routes.js';
import accountRoute from './Routes/accounts.routes.js';
import paymentRoute from './Routes/payment.routes.js'
import payoutRoute from './Routes/payout.routes.js'
import notificationRoute from './Routes/notification.routes.js'
import mongoose from "mongoose";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import expressMongoSanitize from 'express-mongo-sanitize';


dotenv.config({
    path: "./.env"
});

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: [
        process.env.FRONTEND_URI, 
        'https://payme.sudhanshujha.tech'
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(expressMongoSanitize());
app.use(helmet());



mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Database connection successful!");
    })
    .catch(err => {
        console.error("Error in DB connection: ", err);
        process.exit(1); 
    });

app.use('/api/user', userRoute);
app.use('/api/account', accountRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/payout', payoutRoute);
app.use('/api/notifications', notificationRoute);


app.get('/test', (req, res) => {
    res.json({
        msg: "PAYME backend is working well sudhanshuJha01"
    });
});

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});
