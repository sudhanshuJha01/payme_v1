import {Router} from 'express';
import userRouter from './userRouter.js'
import accountsRouter from './accountsRouter.js'
const router = Router();

router.use('/user' , userRouter)
router.use('/accounts',accountsRouter)

export default router;