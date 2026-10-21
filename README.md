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


## Chạy bằng Docker

Cần có Docker Desktop và container MongoDB tên `nammongodb` từ bước trước.

```bash
docker start nammongodb
docker network create product-net
docker network connect product-net nammongodb
```

Tạo tệp `.env.docker` trong thư mục dự án:

```env
PORT=3000
MONGODB_URI=mongodb://nammongodb:27017/productdb
```

Build và chạy API:

```bash
docker build -t product-api:local .
docker run -d --name product-api --network product-net --env-file .env.docker -p 127.0.0.1:3000:3000 product-api:local
```
Các lệnh tạo mạng, nối mạng và `docker run` chỉ dùng lần đầu. Những lần sau, chạy `docker start nammongodb product-api`.

Kiểm tra:

```bash
curl -i http://localhost:3000/health
curl -i http://localhost:3000/api/products
```

## Chạy bằng Docker Compose

Tạo `.env.docker` theo nội dung ở phần trên. Compose sẽ chạy MongoDB riêng và mở API tại cổng 3001.

```bash
docker compose up -d --build
docker compose ps
curl -i http://localhost:3001/health
curl -i http://localhost:3001/api/products
```

Dừng hai dịch vụ khi cần:

```bash
docker compose down
```

Lệnh `down` ở trên giữ lại volume dữ liệu MongoDB.