import express, { json, urlencoded } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { errorHandler } from '../middlewares/error-handler.middleware';
import { permissions } from '../middlewares/has-permitions.middleware';
import attemptRouter from './attempt.router';
import groupsRouter from './groups.router';
import projectRouter from './project.router';
import tasksRouter from './tasks.router';
import userRouter from './user.router';

export default express.Router()
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(auth())
    .use(permissions())
    .use("/users", userRouter)
    .use("/groups", groupsRouter)
    .use("/projects", projectRouter)
    .use("/tasks", tasksRouter)
    .use("/attempts", attemptRouter)
    .use(errorHandler());