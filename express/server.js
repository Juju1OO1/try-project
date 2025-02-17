import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import connectDB from  './public/js/db.js';
import router from './routes/auth.js';
import dotenv from 'dotenv';
import session from 'express-session'; // 引入 express-session






const app = express();
const port = 3000;


// 連線 MongoDB
connectDB();

// 設置中介層
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 設定 express-session
dotenv.config();
app.use(session({
    secret: process.env.SESSION_SECRET, // 替換為一個更安全的密鑰
    resave: false,          // 避免每次請求都重新儲存 session
    saveUninitialized: false, // 避免儲存空的 session
}));




// 處理 Express 中的 __dirname 問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 使用者登入路由
app.use('/auth', router);



// 靜態檔案目錄
app.use(express.static(path.join(__dirname, "public")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// 圖片上傳
const uploadDirectory = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDirectory),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    // 確保文件成功上傳
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File uploaded: ${req.file.path}`);

    // Python 調用
    const pythonScript = path.join(__dirname, 'do.py'); // 确保脚本路径正确
    const filePath = req.file.path; // 把文件上傳路徑給 Python 

    exec(`python3 ${pythonScript} ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Python Error: ${error.message}`);
            return res.status(500).json({ error: 'Python script execution failed' });
        }
        if (stderr) {
            console.error(`Python Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        console.log(`Python Output: ${stdout}`);
        // 返回成功响应，包括上传文件和 Python 输出
        res.json({
            message: 'File uploaded and processed successfully!',
            file: req.file,
            pythonOutput: stdout.trim(), // 返回 Python 脚本的输出
        });
    });
});












// 啟動伺服器
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
