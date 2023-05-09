import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registrationValidator, loginValidator, postCreateValidator } from './Validations.js';

import CheckAuth from './utils/CheckAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import * as TagsController from './controllers/TagsController.js';

mongoose
    .connect('mongodb+srv://admin:Battlefield228@cluster0.yqqnbrz.mongodb.net/blogdotnet?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Ok'))
    .catch((err) => console.log('MongoDB Error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/registration', registrationValidator, handleValidationErrors, UserController.registration);
app.get('/auth/me', CheckAuth, UserController.getMe);

app.post('/upload', CheckAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', TagsController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', CheckAuth, postCreateValidator, handleValidationErrors, PostController.create);
app.delete('/posts/:id', CheckAuth, PostController.remove);
app.patch('/posts/:id', CheckAuth, postCreateValidator, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server Started')
})