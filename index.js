import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';

import { registrationValidator } from './validations/auth.js';

import UserModel from './models/User.js';

mongoose
    .connect('mongodb+srv://admin:Battlefield228@cluster0.yqqnbrz.mongodb.net/blogdotnet?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Ok'))
    .catch((err) => console.log('MongoDB Error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        })

        if(!user) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretKey',
            {
                expiresIn: '30d',
            },
        );
        
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
});

app.post('/auth/registration', registrationValidator, async (req, res) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
        {
            _id: user._id,
        },
        'secretKey',
        {
            expiresIn: '30d',
        },
    );
    
    const { passwordHash, ...userData } = user._doc;

    res.json({
        ...userData,
        token,
    });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироватсья',
        });
    }
});

app.get('/auth/me', (req, res) => {
    try {
        
    } catch (err) {}
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server Started')
})