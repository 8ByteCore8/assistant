import express, { json, urlencoded } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { errorHandler } from '../middlewares/error-handler.middleware';
import { permissions } from '../middlewares/has-permitions.middleware';
import attemptRouter from './attempt.router';
import groupsRouter from './group.router';
import projectRouter from './project.router';
import tasksRouter from './task.router';
import userRouter from './user.router';
import validatorRouter from './validator.router';
import variantRouter from './variant.router';

export default express.Router()
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(auth())
    .use(permissions())
    .use("/attempts", attemptRouter)
    .use("/groups", groupsRouter)
    .use("/projects", projectRouter)
    .use("/tasks", tasksRouter)
    .use("/users", userRouter)
    .use("/validators", validatorRouter)
    .use("/variants", variantRouter)
    .use(errorHandler());