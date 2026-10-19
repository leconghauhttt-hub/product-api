# Product API

RESTful API quản lý sản phẩm bằng Express, Mongoose và MongoDB.

## Chạy trên máy

1. Khởi động Docker Desktop.
2. Nếu chưa có container MongoDB, chạy `docker run -d --name nammongodb -p 127.0.0.1:27017:27017 mongo:8.0-noble`. Nếu đã có, chạy `docker start nammongodb`.
3. Cài thư viện bằng `npm ci`.
4. Sao chép `.env.example` thành `.env`.
5. Chạy API bằng `node server.js`.

API chạy tại `http://localhost:3000`. Kiểm tra kết nối tại `/health`.

## Các API

| Phương thức | Địa chỉ | Chức năng |
| --- | --- | --- |
| GET | `/api/products` | Lấy danh sách |
| GET | `/api/products/:pid` | Xem một sản phẩm |
| POST | `/api/products` | Tạo sản phẩm |
| PUT | `/api/products/:pid` | Cập nhật sản phẩm |
| DELETE | `/api/products/:pid` | Xóa sản phẩm |

Sản phẩm có các trường: `pid`, `pname`, `price`, `quantity`.