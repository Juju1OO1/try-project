const express = require('express');
const path = require('path');

const app = express();

// 設置靜態檔案夾（如需要）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 使用上傳圖片的路由
const uploadRoute = require('./routes/upload');
app.use(uploadRoute);

// 錯誤處理（可選）
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
