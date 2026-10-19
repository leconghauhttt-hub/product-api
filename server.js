require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.name });
});

async function start() {
  try {
    if (!process.env.MONGODB_URI || !process.env.PORT) {
      throw new Error('Thiếu MONGODB_URI hoặc PORT trong .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Đã kết nối MongoDB:', mongoose.connection.name);

    app.listen(process.env.PORT, () => {
      console.log(`API đang chạy tại http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Không thể khởi chạy API:', error.message);
    process.exit(1);
  }
}

start();