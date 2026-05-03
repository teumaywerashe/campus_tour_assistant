import { Router } from 'express';
import {  loginAdmin, registerAdmin } from '../controller/auth';


const userRouter = Router();

userRouter.post('/login', loginAdmin);
userRouter.post('/register', registerAdmin);


export default userRouter;
