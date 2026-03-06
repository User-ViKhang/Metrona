# 📚 METRONA E-COMMERCE API DOCUMENTATION

## 🎯 Phase 1 - MVP Backend

**Base URL:** `http://localhost:3000/api/v1`

---

## 📋 API ENDPOINTS SUMMARY

### 1️⃣ AUTH - Xác thực

| Method | Endpoint              | Description           | Auth         
|--------|-----------------------|-----------------------|-------------
| POST   | `/auth/register`      | Đăng ký tài khoản mới | ❌ Public   
| POST   | `/auth/login`         | Đăng nhập             | ❌ Public   
| POST   | `/auth/logout`        | Đăng xuất             | ✅ Required 
| POST   | `/auth/refresh-token` | Làm mới token         | ❌ Public   

---

### 2️⃣ USER - Quản lý người dùng

| Method | Endpoint        | Description           | Auth         
|--------|-----------------|-----------------------|------------        
| GET    | `/users/me`     | Lấy thông tin profile | ✅ Required 
| PUT    | `/users/me`     | Cập nhật profile      | ✅ Required

---

### 3️⃣ ADDRESS - Quản lý địa chỉ

| Method | Endpoint                 | Description           | Auth         
|--------|-------------------------|-----------------------|------------        
| GET    | `/addresses`            | Lấy danh sách địa chỉ | ✅ Required 
| GET    | `/addresses/default`    | Lấy địa chỉ mặc định  | ✅ Required 
| GET    | `/addresses/:id`        | Lấy chi tiết địa chỉ  | ✅ Required 
| POST   | `/addresses`            | Thêm địa chỉ mới      | ✅ Required 
| PUT    | `/addresses/:id`        | Cập nhật địa chỉ      | ✅ Required 
| PATCH  | `/addresses/:id/default`| Đặt địa chỉ mặc định  | ✅ Required 
| DELETE | `/addresses/:id`        | Xóa địa chỉ           | ✅ Required 

---

### 4️⃣ SHOP - Quản lý Shop

| Method | Endpoint                   | Description                | Auth         
|--------|----------------------------|----------------------------|------------        
| POST   | `/shops`                   | Tạo shop mới               | ✅ Required 
| GET    | `/shops/me`                | Lấy thông tin shop của tôi | ✅ SELLER 
| PUT    | `/shops/me`                | Cập nhật shop              | ✅ SELLER 
| GET    | `/shops/search?q=keyword`  | Tìm kiếm shop              | ❌ Public 
| GET    | `/shops/:id`               | Xem chi tiết shop          | ❌ Public 
| GET    | `/shops/:id/products`      | Lấy sản phẩm của shop      | ❌ Public

---

### 5️⃣ PRODUCT - Sản phẩm

| Method | Endpoint        | Description        | Auth         
|--------|-----------------|--------------------|-----------        
| POST   | `/products`     | Tạo sản phẩm mới   | ✅ SELLER 
| GET    | `/products`     | Danh sách sản phẩm | ❌ Public 
| GET    | `/products/me`  | Sản phẩm của tôi   | ✅ SELLER 
| GET    | `/products/:id` | Chi tiết sản phẩm  | ❌ Public 
| PUT    | `/products/:id` | Cập nhật sản phẩm  | ✅ SELLER 
| DELETE | `/products/:id` | Xóa sản phẩm       | ✅ SELLER

**Query Parameters cho GET `/products`:**
- `page` - Trang (default: 1)
- `limit` - Số item/trang (default: 20, max: 100)
- `search` - Từ khóa tìm kiếm
- `categoryId` - Filter theo category
- `shopId` - Filter theo shop
- `minPrice` - Giá tối thiểu
- `maxPrice` - Giá tối đa
- `sortBy` - Sắp xếp: `newest`, `price_low`, `price_high`, `best_selling`, `rating`

---

### 6️⃣ CATEGORY - Danh mục

| Method | Endpoint       | Description        | Auth         
|--------|----------------|--------------------|-----------        
| GET    | `/categories`  | Danh sách danh mục | ❌ Public 

**Response Example:**
```json
[
  {
    "id": "uuid",
    "name": "Điện thoại",
    "nameEn": "Phones",
    "slug": "dien-thoai",
    "parentId": null,
    "icon": "phone-icon.svg",
    "order": 1
  }
]
```

---

### 7️⃣ CART - Giỏ hàng

| Method | Endpoint          | Description            | Auth         
|--------|-------------------|------------------------|-----------        
| GET    | `/cart`           | Lấy giỏ hàng           | ✅ Required 
| POST   | `/cart/items`     | Thêm sản phẩm vào giỏ  | ✅ Required 
| PUT    | `/cart/items/:id` | Cập nhật số lượng      | ✅ Required 
| DELETE | `/cart/items/:id` | Xóa sản phẩm khỏi giỏ  | ✅ Required 
| DELETE | `/cart`           | Xóa toàn bộ giỏ hàng   | ✅ Required 
| GET    | `/cart/count`     | Đếm số sản phẩm        | ✅ Required

---

### 8️⃣ ORDER - Đơn hàng (Buyer)

| Method | Endpoint               | Description                | Auth         
|--------|------------------------|----------------------------|-----------        
| POST   | `/orders`              | Tạo đơn hàng               | ✅ Required 
| GET    | `/orders`              | Danh sách đơn hàng của tôi | ✅ Required 
| GET    | `/orders/:id`          | Chi tiết đơn hàng          | ✅ Required 
| PATCH  | `/orders/:id/cancel`   | Hủy đơn hàng               | ✅ Required 
| PATCH  | `/orders/:id/received` | Xác nhận đã nhận hàng      | ✅ Required

---

### 9️⃣ SELLER ORDER - Đơn hàng (Seller)

| Method | Endpoint                      | Description                 | Auth         
|--------|-------------------------------|-----------------------------|----------        
| GET    | `/seller/orders`              | Danh sách đơn hàng của shop | ✅ SELLER 
| GET    | `/seller/orders/stats`        | Thống kê đơn hàng           | ✅ SELLER 
| GET    | `/seller/orders/:id`          | Chi tiết đơn hàng           | ✅ SELLER 
| PATCH  | `/seller/orders/:id/confirm`  | Xác nhận đơn hàng           | ✅ SELLER 
| PATCH  | `/seller/orders/:id/ship`     | Bắt đầu giao hàng           | ✅ SELLER 
| PATCH  | `/seller/orders/:id/deliver`  | Đánh dấu đã giao            | ✅ SELLER 
| PATCH  | `/seller/orders/:id/cancel`   | Hủy đơn hàng                | ✅ SELLER

---

### 🔟 CHAT - Nhắn tin

| Method | Endpoint              | Description                | Auth         
|--------|-----------------------|----------------------------|-----------        
| GET    | `/chats`              | Danh sách phòng chat       | ✅ Required 
| POST   | `/chats/shop/:shopId` | Tạo/lấy phòng chat với shop| ✅ Required 
| GET    | `/chats/:id/messages` | Lấy tin nhắn               | ✅ Required 
| POST   | `/chats/:id/messages` | Gửi tin nhắn               | ✅ Required 
| PATCH  | `/chats/:id/read`     | Đánh dấu đã đọc            | ✅ Required 
| GET    | `/chats/unread-count` | Đếm tin chưa đọc           | ✅ Required

---

### 🔟 WEBSOCKET - Chat Realtime

**Namespace:** `/chat`

**Events:**

| Event               | Direction        | Description            
|---------------------|------------------|------------------------
| `chat:join`         | Client → Server  | Tham gia phòng chat 
| `chat:leave`        | Client → Server  | Rời phòng chat 
| `chat:send`         | Client → Server  | Gửi tin nhắn 
| `chat:receive`      | Server → Client  | Nhận tin nhắn mới 
| `chat:typing`       | Bidirectional    | Trạng thái đang nhập 
| `chat:read`         | Bidirectional    | Đánh dấu đã đọc 
| `chat:notification` | Server → Client  | Thông báo tin nhắn mới

---

### ADDRESSES - Địa chỉ (address)

**Namespace:** `/addresses`

**Events:**

| Method | Endpoint                 | Description           | Auth         |
|--------|-------------------------|-----------------------|--------------|
| GET    | `/addresses`            | Lấy danh sách địa chỉ | ✅ Required  |
| GET    | `/addresses/default`    | Lấy địa chỉ mặc định  | ✅ Required  |
| GET    | `/addresses/:id`        | Lấy chi tiết địa chỉ  | ✅ Required  |
| POST   | `/addresses`            | Thêm địa chỉ mới      | ✅ Required  |
| PUT    | `/addresses/:id`        | Cập nhật địa chỉ      | ✅ Required  |
| PATCH  | `/addresses/:id/default`| Đặt địa chỉ mặc định  | ✅ Required  |
| DELETE | `/addresses/:id`        | Xóa địa chỉ           | ✅ Required  |

---

### 🏥 HEALTH CHECK

| Method | Endpoint  | Description                  | Auth         
|--------|-----------|------------------------------|----------        
| GET    | `/health` | Kiểm tra trạng thái hệ thống | ❌ Public

---

## 📊 ORDER STATUS FLOW

```
PENDING → CONFIRMED → SHIPPING → DELIVERED → COMPLETED
    ↓         ↓
 CANCELLED  CANCELLED
```

| Status             | Description                  
|--------------------|------------------------------
| `PENDING`          | Đơn hàng mới, chờ xác nhận 
| `CONFIRMED`        | Seller đã xác nhận 
| `SHIPPING`         | Đang vận chuyển 
| `DELIVERED`        | Đã giao hàng 
| `COMPLETED`        | Buyer xác nhận đã nhận 
| `CANCELLED`        | Đã hủy 
| `RETURN_REQUESTED` | Yêu cầu trả hàng (Phase 2) 
| `RETURNED`         | Đã trả hàng (Phase 2)

---

## 🔐 AUTHENTICATION

**Header:** `Authorization: Bearer <access_token>`

**Roles:**
- `USER` - Người mua hàng
- `SELLER` - Chủ shop (tự động upgrade khi tạo shop)
- `ADMIN` - Quản trị viên (Phase 2)

---

## 🌍 INTERNATIONALIZATION

**Supported Languages:** `vi` (Vietnamese), `en` (English)

**Set Language:**
- Query: `?lang=vi` hoặc `?locale=en`
- Header: `Accept-Language: vi`

---

## 📦 RESPONSE FORMAT

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-12-31T10:00:00.000Z"
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "timestamp": "2024-12-31T10:00:00.000Z",
  "path": "/api/v1/..."
}
```

---

## 🚀 GETTING STARTED

### 1. Setup Environment
```bash
# Copy env example
cp .env.example .env

# Edit .env with your database credentials
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run start:dev
```

### 5. Open Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```

---

## 📁 PROJECT STRUCTURE

```
src/
├── auth/               # Authentication module
│   ├── dto/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users/              # User management
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── addresses/          # Address management
│   ├── dto/
│   ├── addresses.controller.ts
│   ├── addresses.service.ts
│   └── addresses.module.ts
│
├── shops/              # Shop management
│   ├── dto/
│   ├── shops.controller.ts
│   ├── shops.service.ts
│   └── shops.module.ts
│
├── products/           # Product management
│   ├── dto/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
│
├── cart/               # Shopping cart
│   ├── dto/
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── cart.module.ts
│
├── orders/             # Order management
│   ├── dto/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
│
├── chats/              # Chat & WebSocket
│   ├── dto/
│   ├── chats.controller.ts
│   ├── chats.service.ts
│   ├── chats.gateway.ts
│   └── chats.module.ts
│
├── prisma/             # Database service
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
├── redis/              # Cache service
│   ├── redis.service.ts
│   └── redis.module.ts
│
├── common/             # Shared utilities
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   ├── interceptors/
│   ├── dto/
│   └── utils/
│
├── i18n/               # Translations
│   ├── vi/
│   └── en/
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts

prisma/
└── schema.prisma       # Database schema
```

---

## 🗄️ DATABASE TABLES

| Table                | Description          
|----------------------|----------------------
| `users`              | Người dùng 
| `refresh_tokens`     | Refresh tokens 
| `addresses`          | Địa chỉ giao hàng 
| `shops`              | Cửa hàng 
| `products`           | Sản phẩm 
| `product_images`     | Hình ảnh sản phẩm 
| `categories`         | Danh mục 
| `product_categories` | Sản phẩm - Danh mục 
| `carts`              | Giỏ hàng 
| `cart_items`         | Chi tiết giỏ hàng 
| `orders`             | Đơn hàng 
| `order_items`        | Chi tiết đơn hàng 
| `chat_rooms`         | Phòng chat 
| `chat_participants`  | Thành viên chat 
| `messages`           | Tin nhắn

