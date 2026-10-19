const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ pid: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được danh sách sản phẩm' });
  }
});

router.get('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);

  if (!Number.isInteger(pid) || pid < 1) {
    return res.status(400).json({ message: 'pid phải là số nguyên dương' });
  }

  try {
    const product = await Product.findOne({ pid });

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được sản phẩm' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;
    const product = await Product.create({ pid, pname, price, quantity });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'pid đã tồn tại' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Không tạo được sản phẩm' });
  }
});

router.put('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);

  if (!Number.isInteger(pid) || pid < 1) {
    return res.status(400).json({ message: 'pid phải là số nguyên dương' });
  }

  const { pname, price, quantity } = req.body || {};
  if ([pname, price, quantity].some(value => value === undefined)) {
    return res.status(400).json({
      message: 'Cần nhập pname, price và quantity'
    });
  }

  try {
    const product = await Product.findOneAndUpdate(
      { pid },
      { pname, price, quantity },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Không cập nhật được sản phẩm' });
  }
});

router.delete('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);

  if (!Number.isInteger(pid) || pid < 1) {
    return res.status(400).json({ message: 'pid phải là số nguyên dương' });
  }

  try {
    const product = await Product.findOneAndDelete({ pid });

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Đã xóa sản phẩm', product });
  } catch (error) {
    res.status(500).json({ message: 'Không xóa được sản phẩm' });
  }
});

module.exports = router;