import bcrypt from 'bcryptjs';
import User from './user.js'; // 匯入 User 模型

const loginUser = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('帳號或密碼錯誤');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('帳號或密碼錯誤');
        }

        return user; // 驗證成功，返回使用者資料
    } catch (err) {
        throw err;
    }
};

export default loginUser;
