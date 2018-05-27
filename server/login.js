import jwt from 'jsonwebtoken';
import { Router } from 'express';
import User from './models/user';
import md5 from 'md5';
import config from './config';

const router = Router();

router.post('/', function(req, res, next) {
    const data = req.body;
    User.findOne({ email: data.username, password: md5(data.password) }, { email: 1, name: 1 })
    .then(function(user) {   
        if (user) {
            const token = jwt.sign(user.toObject(), config.secret_key);
            res.status(200).json({ token, user });
        } else {
            const error = "Wrong credentials.";
            res.statusMessage = error;
            res.status(403).send(error);
            next(new Error(error));
        }
    }).catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});

export default router;