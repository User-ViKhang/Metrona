# 🔐 Authentication Integration

## ✅ Đã hoàn thành

Frontend đã được kết nối với backend API để xử lý authentication.

### Các tính năng đã implement:

1. **API Client** (`src/lib/api.ts`)
   - Kết nối với backend API
   - Tự động thêm JWT token vào headers
   - Xử lý errors

2. **Auth Context** (`src/contexts/AuthContext.tsx`)
   - Quản lý state authentication
   - Lưu trữ user info
   - Cung cấp hooks: `useAuth()`

3. **Login/Register Modal** (`src/components/auth/LoginModal.tsx`)
   - Form đăng nhập/đăng ký
   - Kết nối với API
   - Hiển thị errors

4. **Header Component** (`src/components/layout/Header.tsx`)
   - Hiển thị user info khi đã login
   - Dropdown menu với logout
   - Nút đăng nhập khi chưa login

## 🚀 Cách sử dụng

### 1. Đảm bảo Backend đang chạy

```bash
cd server
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### 2. Chạy Frontend

```bash
cd client
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000` (Next.js sẽ tự động chuyển sang port khác nếu 3000 đã được dùng)

### 3. Test Authentication

1. Mở trang chủ: http://localhost:3000
2. Click nút "Đăng nhập" ở header
3. Chuyển sang tab "Đăng ký" để tạo tài khoản mới
4. Điền thông tin:
   - Email: test@example.com
   - Password: password123
   - Họ và tên: Nguyễn Văn A
   - Số điện thoại: 0123456789 (optional)
5. Click "Đăng ký"
6. Sau khi đăng ký thành công, bạn sẽ tự động đăng nhập
7. Header sẽ hiển thị tên user và dropdown menu

### 4. Test Logout

1. Click vào tên user ở header
2. Click "Đăng xuất"
3. User sẽ được đăng xuất và quay về trạng thái chưa login

## 📝 API Endpoints được sử dụng

- `POST /api/v1/auth/register` - Đăng ký tài khoản mới
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất
- `POST /api/v1/auth/refresh-token` - Làm mới token
- `GET /api/v1/users/me` - Lấy thông tin profile

## 🔧 Configuration

File `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 💾 Token Storage

- Access Token: Lưu trong `localStorage` với key `accessToken`
- Refresh Token: Lưu trong `localStorage` với key `refreshToken`
- Tự động thêm vào header: `Authorization: Bearer <token>`

## 🎯 useAuth Hook

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();

  // user: User object hoặc null
  // isAuthenticated: boolean
  // isLoading: boolean
  // login: (credentials) => Promise<void>
  // register: (data) => Promise<void>
  // logout: () => Promise<void>
}
```

## 🐛 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, đảm bảo backend đã enable CORS cho frontend URL.

### Token expired
Token sẽ tự động refresh khi hết hạn (implement trong tương lai).

### Connection refused
Đảm bảo backend đang chạy ở port 3000.

## 📚 Next Steps

- [ ] Implement auto token refresh
- [ ] Add loading states
- [ ] Add form validation
- [ ] Add password strength indicator
- [ ] Add "Remember me" functionality
- [ ] Add social login (Google, Facebook)
