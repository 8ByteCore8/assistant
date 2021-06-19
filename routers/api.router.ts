import express, { json, urlencoded } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { errorHandler } from '../middlewares/error-handler.middleware';
import { permissions } from '../middlewares/has-permitions.middleware';
import groupsRouter from './groups.router';
import projectRouter from './project.router';
import userRouter from './user.router';

export default express.Router()
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(auth())
    .use(permissions())
    .use("/users", userRouter)
    .use("/projects", projectRouter)
    .use("/groups", groupsRouter)
    .use(errorHandler());