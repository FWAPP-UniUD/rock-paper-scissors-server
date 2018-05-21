import jwt from 'jsonwebtoken';
import { Router } from 'express';

const router = Router();

router.post('/', function(req, res, next) {
    const token = jwt.sign({ foo: "bar" }, 'shhhhh');
    res.status(200).json({ token });
});

export default router;