import {Router} from 'express';
import userRouter from './userRouter.js'
import accountsRouter from './accountsRouter.js'
import meVerify from './meVerify.js'


const router = Router();

router.use('/user' , userRouter)
router.use('/accounts',accountsRouter)
router.use('/me' , meVerify)
export default router;