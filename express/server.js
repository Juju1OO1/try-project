import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// 處理 ES 模組中的 __dirname 問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 靜態檔案
app.use(express.static(path.join(__dirname, "public")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// 影像上傳
const uploadDirectory = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDirectory),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ message: 'File uploaded successfully!', file: req.file });
});

// 啟動伺服器
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
