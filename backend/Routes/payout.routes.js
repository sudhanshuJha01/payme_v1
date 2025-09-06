import { Router } from 'express';
import { userAuthMiddleware } from "../middlewares/verifyJWT.js";
import { 
    addBankAccount, 
    initiatePayout, 
    getBeneficiaries 
} from '../controllers/payout.controller.js';

const payoutRoute = Router();

// Route to get all saved beneficiaries for the logged-in user
payoutRoute.get('/beneficiaries', userAuthMiddleware, getBeneficiaries);

// Route to add a new bank account as a beneficiary
payoutRoute.post('/add-bank-account', userAuthMiddleware, addBankAccount);

// Route to initiate the withdrawal to a linked bank account
payoutRoute.post('/withdraw', userAuthMiddleware, initiatePayout);

export default payoutRoute;