import express from 'express';
import mongoose from 'mongoose';

import { registrationValidator, loginValidator, postCreateValidator } from './Validations.js';

import CheckAuth from './utils/CheckAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
    .connect('mongodb+srv://admin:Battlefield228@cluster0.yqqnbrz.mongodb.net/blogdotnet?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Ok'))
    .catch((err) => console.log('MongoDB Error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidator, UserController.login);

app.post('/auth/registration', registrationValidator, UserController.registration);

app.get('/auth/me', CheckAuth, UserController.getMe);


//app.get('/posts', PostController.getAll);

//app.get('/posts/:id', PostController.getOne);

app.post('/posts', CheckAuth, postCreateValidator, PostController.create);

//app.delete('/posts', PostController.remove);

//app.patch('/posts', PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server Started')
})