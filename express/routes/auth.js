import express from 'express';
import bcrypt from'bcryptjs';
import User from '../public/js/user.js';
import loginUser from '../public/js/login.js';

const router = express.Router();

// 註冊路由
router.post('/register', async (req, res) => {
    const { username,  password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).send('註冊成功');
    } catch (err) {
        res.status(500).send('伺服器錯誤');
    }
});

// 登入路由
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await loginUser(username, password);
        req.session.user = user; // 儲存登入狀態
        res.send('登入成功');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// 登出路由
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('已登出');
    });
});

export default router;
