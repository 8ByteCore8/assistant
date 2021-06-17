import express, { json, urlencoded } from 'express';
import auth from '../middlewares/auth.middleware';
import errorHandler from '../middlewares/error-handler.middleware';
import { permissions } from '../middlewares/has-permitions.middleware';
import authRouter from './auth.router';

export default express.Router()
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(auth())
    .use(permissions())
    .use("/auth", authRouter)
    .use(errorHandler());