import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Server from './models/server';
import buildingRouter from './route/buildingRouter';
import feedbackRouter from './route/feedback';
import userRouter from './route/auth';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const server = new Server();

server.app.use(express.json());
server.app.use(cors());
server.app.use('/api/user', userRouter);
server.app.use('/api/building', buildingRouter);
server.app.use('/api/feedback', feedbackRouter);
server.app.use(globalErrorHandler);

server.listen();
