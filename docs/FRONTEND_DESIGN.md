# 📦 Metrona E-Commerce Frontend Design

## Mục lục
- [1. Tổng quan](#1-tổng-quan)
- [2. User Roles & Permissions](#2-user-roles--permissions)
- [3. User Flows](#3-user-flows)
- [4. Pages Structure](#4-pages-structure)
- [5. Components](#5-components)
- [6. Business Logic Rules](#6-business-logic-rules)
- [7. State Management](#7-state-management)
- [8. API Integration](#8-api-integration)

---

## 1. Tổng quan

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Context
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios / TanStack Query
- **Authentication**: NextAuth.js / JWT

### Cấu trúc thư mục
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (main)/            # Main layout group
│   │   ├── page.tsx       # Dashboard/Home
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── profile/
│   ├── admin/             # Admin panel
│   └── layout.tsx
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── products/          # Product-related
│   ├── cart/              # Cart-related
│   ├── auth/              # Auth-related
│   └── common/            # Shared components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities & configs
├── services/              # API services
├── stores/                # State stores
├── types/                 # TypeScript types
└── styles/                # Global styles
```

---

## 2. User Roles & Permissions

### 2.1 Vai trò người dùng

| Role         | Mô tả                              |
|--------------|------------------------------------| 
| **Guest**    | Khách vãng lai, chưa đăng nhập     |
| **Customer** | Khách hàng đã đăng ký và đăng nhập |
| **Admin**    | Quản trị viên hệ thống             |

### 2.2 Ma trận quyền hạn

| Tính năng              | Guest | Customer  |  Admin |
|------------------------|:-----:|:--------: |:------:|
| Xem Dashboard/Home     |  ✅   |    ✅    |  ✅   |
| Xem danh sách sản phẩm |  ✅   |    ✅    |  ✅   |
| Xem chi tiết sản phẩm  |  ✅   |    ✅    |  ✅   |
| Xem danh mục           |  ✅   |    ✅    |  ✅   |
| Tìm kiếm sản phẩm      |  ✅   |    ✅    |  ✅   |
| Thêm vào giỏ hàng      |  ❌   |    ✅    |  ✅   |
| Xem giỏ hàng           |  ❌   |    ✅    |  ✅   |
| Checkout/Thanh toán    |  ❌   |    ✅    |  ✅   |
| Xem lịch sử đơn hàng   |  ❌   |    ✅    |  ✅   |
| Đánh giá sản phẩm      |  ❌   |    ✅    |  ✅   |
| Quản lý profile        |  ❌   |    ✅    |  ✅   |
| Wishlist/Yêu thích     |  ❌   |    ✅    |  ✅   |
| Quản lý sản phẩm       |  ❌   |    ❌    |  ✅   |
| Quản lý đơn hàng       |  ❌   |    ❌    |  ✅   |
| Quản lý người dùng     |  ❌   |    ❌    |  ✅   |
| Xem báo cáo/thống kê   |  ❌   |    ❌    |  ✅   |

---

## 3. User Flows

### 3.1 Guest Flow (Khách vãng lai)

```
┌─────────────────────────────────────────────────────────────────┐
│                        GUEST FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Truy cập website]                                            │
│         │                                                       │
│         ▼                                                       │
│   [Dashboard/Home] ───────────────────────────────────────┐     │
│         │                                                 │     │
│         ▼                                                 ▼     │
│   [Xem danh sách SP]                              [Tìm kiếm]    │
│         │                                                 │     │
│         ▼                                                 │     │
│   [Xem chi tiết SP] ◄─────────────────────────────────────┘     │
│         │                                                       │
│         ▼                                                       │
│   [Nhấn "Mua hàng" / "Thêm giỏ hàng"]                           │
│         │                                                       │
│         ▼                                                       │
│   [Modal: "Vui lòng đăng nhập để mua hàng"]                     │
│         │                                                       │
│         ├──────────────────┬────────────────────┐               │
│         ▼                  ▼                    ▼               │
│   [Đăng nhập]        [Đăng ký]           [Tiếp tục xem]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Authentication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐      ┌─────────────────┐                   │
│   │    ĐĂNG NHẬP    │      │    ĐĂNG KÝ      │                   │
│   └────────┬────────┘      └────────┬────────┘                   │
│            │                        │                            │
│            ▼                        ▼                            │
│   [Form: Email/Password]    [Form: Thông tin]                    │
│            │                        │                            │
│            ▼                        ▼                            │
│   [Validate]                [Validate + Create]                  │
│            │                        │                            │
│            ▼                        ▼                            │
│   [Generate JWT Token]      [Send Verify Email]                  │
│            │                        │                            │
│            ▼                        ▼                            │
│   [Store Token]             [Verify Email]                       │
│            │                        │                            │
│            └────────────┬───────────┘                            │
│                         ▼                                        │
│              [Redirect to Dashboard]                             │
│                                                                  │
│   ┌─────────────────────────────────────────┐                    │
│   │           QUÊN MẬT KHẨU                 │                    │
│   └────────────────┬────────────────────────┘                    │
│                    ▼                                             │
│            [Nhập Email]                                          │
│                    │                                             │
│                    ▼                                             │
│            [Gửi Reset Link]                                      │
│                    │                                             │
│                    ▼                                             │
│            [Nhập mật khẩu mới]                                   │
│                    │                                             │
│                    ▼                                             │
│            [Cập nhật + Đăng nhập]                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.3 Shopping Flow (Customer)

```
┌──────────────────────────────────────────────────────────────────┐
│                      SHOPPING FLOW                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [Browse Products]                                              │
│         │                                                        │
│         ▼                                                        │
│   [Xem chi tiết SP]                                              │
│         │                                                        │
│         ▼                                                        │
│   [Chọn variant: Size/Color/Quantity]                            │
│         │                                                        │
│         ▼                                                        │
│   [Add to Cart] ─────────────────────────────────────┐           │
│         │                                             │          │
│         ▼                                             ▼          │
│   [Tiếp tục mua]                              [Xem giỏ hàng]     │
│         │                                             │          │
│         │                                             ▼          │
│         │                                    [Cập nhật số lượng] │
│         │                                             │          │
│         │                                             ▼          │
│         └──────────────────────────────────►[Checkout]           │
│                                                       │          │
│                                                       ▼          │
│                                        [Nhập địa chỉ giao hàng]  │
│                                                       │          │
│                                                       ▼          │
│                                        [Chọn phương thức TT]     │
│                                                       │          │
│                                                       ▼          │
│                                        [Xác nhận đơn hàng]       │
│                                                       │          │
│                                                       ▼          │
│                                        [Thanh toán]              │
│                                                       │          │
│                                                       ▼          │
│                                        [Order Success Page]      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.4 Order Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   ORDER MANAGEMENT FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Xem danh sách đơn hàng]                                      │
│         │                                                       │
│         ▼                                                       │
│   [Filter: Trạng thái/Ngày/...]                                 │
│         │                                                       │
│         ▼                                                       │
│   [Xem chi tiết đơn]                                            │
│         │                                                       │
│         ├─────────────────┬──────────────────┐                  │
│         ▼                 ▼                  ▼                  │
│   [Track Order]    [Cancel Order]     [Re-order]                │
│         │               │                  │                    │
│         ▼               ▼                  ▼                    │
│   [Xem timeline]  [Xác nhận hủy]    [Add to cart]               │
│                         │                                       │
│                         ▼                                       │
│                   [Refund Process]                              │
│                                                                 │
│   ┌─────────────────────────────────────────┐                   │
│   │         ORDER STATUS FLOW               │                   │
│   └─────────────────────────────────────────┘                   │
│                                                                 │
│   [Pending] → [Confirmed] → [Processing] → [Shipped]            │
│       │                                        │                │
│       ▼                                        ▼                │
│   [Cancelled]                            [Delivered]            │
│                                               │                 │
│                                               ▼                 │
│                                          [Completed]            │
│                                               │                 │
│                                               ▼                 │
│                                          [Review]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Pages Structure

### 4.1 Public Pages (Accessible by All)

| Route                | Page               | Mô tả                                            |
|----------------------|--------------------|--------------------------------------------------|
| `/`                  | Dashboard/Home     | Trang chủ với banner, sản phẩm nổi bật, danh mục |
| `/products`          | Product List       | Danh sách sản phẩm với filter, sort, pagination  |
| `/products/[slug]`   | Product Detail     | Chi tiết sản phẩm, gallery, mô tả, reviews       |
| `/categories`        | Categories         | Danh sách tất cả danh mục                        |
| `/categories/[slug]` | Category Products  | Sản phẩm theo danh mục                           |
| `/search`            | Search Results     | Kết quả tìm kiếm                                 |
| `/about`             | About Us           | Giới thiệu                                       |
| `/contact`           | Contact            | Liên hệ                                          |
| `/faq`               | FAQ                | Câu hỏi thường gặp                               |

### 4.2 Auth Pages

| Route              | Page               | Mô tả           |
|--------------------|--------------------|-----------------|
| `/login`           | Login              | Đăng nhập       |
| `/register`        | Register           | Đăng ký         |
| `/forgot-password` | Forgot Password    | Quên mật khẩu   |
| `/reset-password`  | Reset Password     | Đặt lại mật khẩu|
| `/verify-email`    | Email Verification | Xác thực email  |

### 4.3 Protected Pages (Customer Only)

| Route               | Page           | Mô tả                |
|---------------------|----------------|----------------------|
| `/cart`             | Shopping Cart  | Giỏ hàng             |
| `/checkout`         | Checkout       | Thanh toán           |
| `/checkout/success` | Order Success  | Đặt hàng thành công  |
| `/orders`           | Order History  | Lịch sử đơn hàng     |
| `/orders/[id]`      | Order Detail   | Chi tiết đơn hàng    |
| `/profile`          | User Profile   | Thông tin cá nhân    |
| `/profile/addresses`| Address Book   | Sổ địa chỉ           |
| `/profile/password` | Change Password| Đổi mật khẩu         |
| `/wishlist`         | Wishlist       | Sản phẩm yêu thích   |

### 4.4 Admin Pages

| Route                 | Page                | Mô tả              |
|-----------------------|---------------------|--------------------|
| `/admin`              | Admin Dashboard     | Tổng quan admin    |
| `/admin/products`     | Product Management  | Quản lý sản phẩm   |
| `/admin/products/new` | Add Product         | Thêm sản phẩm      |
| `/admin/products/[id]`| Edit Product        | Sửa sản phẩm       |
| `/admin/categories`   | Category Management | Quản lý danh mục   |
| `/admin/orders`       | Order Management    | Quản lý đơn hàng   |
| `/admin/orders/[id]`  | Order Detail        | Chi tiết đơn hàng  |
| `/admin/users`        | User Management     | Quản lý người dùng |
| `/admin/reports`      | Reports             | Báo cáo thống kê   |
| `/admin/settings`     | Settings            | Cài đặt hệ thống   |

---

## 5. Components

### 5.1 UI Components (Base)

```
components/ui/
├── Button.tsx           # Nút bấm với variants
├── Input.tsx            # Input field
├── Select.tsx           # Dropdown select
├── Checkbox.tsx         # Checkbox
├── Radio.tsx            # Radio button
├── Switch.tsx           # Toggle switch
├── Modal.tsx            # Modal dialog
├── Drawer.tsx           # Slide-out drawer
├── Toast.tsx            # Toast notifications
├── Skeleton.tsx         # Loading skeleton
├── Spinner.tsx          # Loading spinner
├── Badge.tsx            # Status badge
├── Avatar.tsx           # User avatar
├── Card.tsx             # Card container
├── Tabs.tsx             # Tab navigation
├── Accordion.tsx        # Accordion/Collapse
├── Tooltip.tsx          # Tooltip
├── Dropdown.tsx         # Dropdown menu
├── Pagination.tsx       # Pagination
├── Breadcrumb.tsx       # Breadcrumb navigation
└── Rating.tsx           # Star rating
```

### 5.2 Layout Components

```
components/layout/
├── Header/
│   ├── Header.tsx           # Main header
│   ├── Navbar.tsx           # Navigation bar
│   ├── SearchBar.tsx        # Search input
│   ├── UserMenu.tsx         # User dropdown menu
│   ├── CartIcon.tsx         # Cart icon with badge
│   └── MobileMenu.tsx       # Mobile navigation
├── Footer/
│   ├── Footer.tsx           # Main footer
│   ├── FooterLinks.tsx      # Footer navigation
│   ├── Newsletter.tsx       # Newsletter signup
│   └── SocialLinks.tsx      # Social media links
├── Sidebar/
│   ├── Sidebar.tsx          # Sidebar container
│   ├── CategoryMenu.tsx     # Category navigation
│   └── FilterSidebar.tsx    # Product filters
└── Container.tsx            # Page container
```

### 5.3 Product Components

```
components/products/
├── ProductCard.tsx          # Product card in listing
├── ProductGrid.tsx          # Product grid layout
├── ProductList.tsx          # Product list layout
├── ProductGallery.tsx       # Image gallery
├── ProductInfo.tsx          # Product details
├── ProductPrice.tsx         # Price display
├── ProductVariants.tsx      # Size/Color selector
├── ProductQuantity.tsx      # Quantity selector
├── ProductReviews.tsx       # Reviews section
├── ReviewForm.tsx           # Submit review form
├── RelatedProducts.tsx      # Related products
├── ProductFilter.tsx        # Filter controls
├── ProductSort.tsx          # Sort dropdown
├── QuickView.tsx            # Quick view modal
└── WishlistButton.tsx       # Add to wishlist
```

### 5.4 Cart Components

```
components/cart/
├── CartDrawer.tsx           # Slide-out cart
├── CartItem.tsx             # Single cart item
├── CartSummary.tsx          # Cart totals
├── CartEmpty.tsx            # Empty cart state
├── MiniCart.tsx             # Mini cart dropdown
├── QuantityInput.tsx        # Quantity controls
└── RemoveItemButton.tsx     # Remove from cart
```

### 5.5 Checkout Components

```
components/checkout/
├── CheckoutSteps.tsx        # Step indicator
├── ShippingForm.tsx         # Shipping address form
├── BillingForm.tsx          # Billing address form
├── AddressSelect.tsx        # Saved address selector
├── PaymentMethods.tsx       # Payment options
├── OrderSummary.tsx         # Order summary
├── CouponInput.tsx          # Coupon/Promo code
├── ShippingOptions.tsx      # Shipping methods
└── PlaceOrderButton.tsx     # Submit order
```

### 5.6 Auth Components

```
components/auth/
├── LoginForm.tsx            # Login form
├── RegisterForm.tsx         # Registration form
├── ForgotPasswordForm.tsx   # Forgot password
├── ResetPasswordForm.tsx    # Reset password
├── SocialLogin.tsx          # OAuth buttons
├── AuthGuard.tsx            # Protected route wrapper
├── GuestGuard.tsx           # Guest-only wrapper
└── LoginPrompt.tsx          # Login required modal
```

### 5.7 Common Components

```
components/common/
├── Banner.tsx               # Hero banner
├── CategoryCard.tsx         # Category card
├── CategorySlider.tsx       # Category carousel
├── FeaturedSection.tsx      # Featured products
├── PromoSection.tsx         # Promotional section
├── TestimonialSlider.tsx    # Customer reviews
├── BrandSlider.tsx          # Brand logos
├── EmptyState.tsx           # Empty state display
├── ErrorState.tsx           # Error display
├── LoadingState.tsx         # Loading display
├── ConfirmDialog.tsx        # Confirmation modal
├── ImageUpload.tsx          # Image uploader
├── RichTextEditor.tsx       # Text editor
├── DataTable.tsx            # Data table
└── StatusBadge.tsx          # Order status badge
```

---

## 6. Business Logic Rules

### 6.1 Authentication Rules

```typescript
// Rule 1: Session Management
- Token expiration: 24 hours (có thể cấu hình)
- Refresh token: 7 days
- Auto logout khi token hết hạn
- Remember me: Extend session to 30 days

// Rule 2: Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character

// Rule 3: Login Attempts
- Max 5 failed attempts
- Lock account for 15 minutes after max attempts
- CAPTCHA after 3 failed attempts
```

### 6.2 Guest Restrictions (⚠️ QUAN TRỌNG)

```typescript
// Các hành động BỊ CHẶN với Guest
const GUEST_BLOCKED_ACTIONS = [
  'ADD_TO_CART',
  'VIEW_CART',
  'CHECKOUT',
  'VIEW_ORDERS',
  'SUBMIT_REVIEW',
  'ADD_TO_WISHLIST',
  'VIEW_WISHLIST',
  'UPDATE_PROFILE',
  'MANAGE_ADDRESSES',
];

// Behavior khi Guest thực hiện hành động bị chặn
const handleGuestAction = (action: string) => {
  if (GUEST_BLOCKED_ACTIONS.includes(action)) {
    // Show login prompt modal
    showModal({
      type: 'LOGIN_PROMPT',
      title: 'Vui lòng đăng nhập',
      message: 'Bạn cần đăng nhập để thực hiện thao tác này',
      actions: [
        { label: 'Đăng nhập', href: '/login' },
        { label: 'Đăng ký', href: '/register' },
        { label: 'Tiếp tục xem', action: 'CLOSE' },
      ],
      // Save intended action for redirect after login
      redirectAfterLogin: currentUrl,
    });
    return false;
  }
  return true;
};
```

### 6.3 Cart Rules

```typescript
// Rule 1: Cart Persistence
- Logged-in users: Cart saved to database
- Cart synced across devices
- Cart preserved after logout/login

// Rule 2: Cart Limits
- Max 99 quantity per item
- Max 50 unique items in cart
- Cart expires after 30 days of inactivity

// Rule 3: Cart Validation
- Check stock availability before checkout
- Update prices if changed
- Remove unavailable items with notification

// Rule 4: Cart Calculation
const calculateCart = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const discount = applyDiscount(subtotal, coupon);
  const shipping = calculateShipping(items, address);
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + shipping + tax;
  
  return { subtotal, discount, shipping, tax, total };
};
```

### 6.4 Order Rules

```typescript
// Rule 1: Order Status Flow
const ORDER_STATUS_FLOW = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['COMPLETED', 'RETURN_REQUESTED'],
  CANCELLED: [], // Terminal state
  COMPLETED: [], // Terminal state
};

// Rule 2: Cancellation Rules
- Có thể hủy khi: PENDING, CONFIRMED
- Không thể hủy khi: PROCESSING, SHIPPED, DELIVERED
- Hoàn tiền tự động khi hủy (nếu đã thanh toán)

// Rule 3: Order Number Format
const generateOrderNumber = () => {
  const prefix = 'MTR';
  const date = format(new Date(), 'yyMMdd');
  const random = generateRandomString(4).toUpperCase();
  return `${prefix}-${date}-${random}`; // MTR-260104-A1B2
};

// Rule 4: Minimum Order
- Minimum order value: 50,000 VND
- Free shipping threshold: 500,000 VND
```

### 6.5 Product Rules

```typescript
// Rule 1: Stock Management
- Out of stock: Disable "Add to Cart"
- Low stock warning: <= 5 items
- Pre-order allowed for certain products

// Rule 2: Pricing
- Sale price must be < original price
- Display discount percentage
- Price history tracking

// Rule 3: Reviews
- Only verified purchasers can review
- 1 review per order item
- Review moderation (optional)
- Rating: 1-5 stars

// Rule 4: Search & Filter
- Fuzzy search support
- Filter by: Category, Price, Rating, Brand, Attributes
- Sort by: Relevance, Price, Date, Popularity, Rating
```

### 6.6 Checkout Rules

```typescript
// Rule 1: Address Validation
- Required fields: Name, Phone, Address, City
- Phone format validation
- Save address for future use

// Rule 2: Payment Methods
const PAYMENT_METHODS = [
  { id: 'COD', name: 'Thanh toán khi nhận hàng', enabled: true },
  { id: 'BANK_TRANSFER', name: 'Chuyển khoản ngân hàng', enabled: true },
  { id: 'MOMO', name: 'Ví MoMo', enabled: true },
  { id: 'VNPAY', name: 'VNPay', enabled: true },
  { id: 'ZALOPAY', name: 'ZaloPay', enabled: true },
];

// Rule 3: Coupon Rules
- One coupon per order
- Minimum order value check
- Expiration date check
- Usage limit check
- First-order coupons
- Category/Product specific coupons

// Rule 4: Shipping
const SHIPPING_METHODS = [
  { id: 'STANDARD', name: 'Giao hàng tiêu chuẩn', days: '3-5', fee: 30000 },
  { id: 'EXPRESS', name: 'Giao hàng nhanh', days: '1-2', fee: 50000 },
  { id: 'SAME_DAY', name: 'Giao trong ngày', days: '0', fee: 80000 },
];
```

### 6.7 User Profile Rules

```typescript
// Rule 1: Profile Update
- Email change requires verification
- Phone change requires OTP
- Name changes limited to 3 times/year

// Rule 2: Address Book
- Max 5 saved addresses
- One default shipping address
- One default billing address

// Rule 3: Account Deletion
- Soft delete (retain for 30 days)
- Cannot delete with pending orders
- Data anonymization after deletion
```

---

## 7. State Management

### 7.1 Global State Structure

```typescript
// stores/index.ts
interface AppState {
  // Auth State
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
  };

  // Cart State
  cart: {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    isOpen: boolean;
    isLoading: boolean;
  };

  // UI State
  ui: {
    isMobileMenuOpen: boolean;
    isSearchOpen: boolean;
    activeModal: string | null;
    toast: ToastMessage | null;
  };

  // Filter State
  filters: {
    category: string | null;
    priceRange: [number, number];
    brands: string[];
    rating: number | null;
    sortBy: string;
  };
}
```

### 7.2 Auth Store

```typescript
// stores/authStore.ts
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}
```

### 7.3 Cart Store

```typescript
// stores/cartStore.ts
interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  
  // Computed
  itemCount: number;
  subtotal: number;
  
  // Actions
  addItem: (product: Product, quantity: number, variant?: Variant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}
```

---

## 8. API Integration

### 8.1 API Endpoints

```typescript
// Auth
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
POST   /api/auth/refresh

// Products
GET    /api/products
GET    /api/products/:slug
GET    /api/products/:id/reviews
POST   /api/products/:id/reviews

// Categories
GET    /api/categories
GET    /api/categories/:slug
GET    /api/categories/:slug/products

// Cart
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart

// Orders
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id/cancel

// Checkout
POST   /api/checkout/validate
POST   /api/checkout/apply-coupon
POST   /api/checkout/calculate-shipping
POST   /api/checkout/create-payment

// User
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/addresses
POST   /api/user/addresses
PUT    /api/user/addresses/:id
DELETE /api/user/addresses/:id
GET    /api/user/wishlist
POST   /api/user/wishlist/:productId
DELETE /api/user/wishlist/:productId

// Admin
GET    /api/admin/dashboard
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/orders
PUT    /api/admin/orders/:id/status
GET    /api/admin/users
GET    /api/admin/reports
```

### 8.2 API Response Format

```typescript
// Success Response
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Response
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

---

## 9. Security Considerations

### 9.1 Frontend Security

```typescript
// CSRF Protection
- Include CSRF token in all mutating requests
- Validate token on server

// XSS Prevention
- Sanitize all user inputs
- Use DOMPurify for rich content
- Set Content-Security-Policy headers

// Auth Security
- Store tokens in httpOnly cookies (preferred) or secure storage
- Never store sensitive data in localStorage
- Implement token refresh mechanism

// Route Protection
- Use middleware for protected routes
- Validate permissions on both client and server
- Handle unauthorized access gracefully
```

### 9.2 Data Validation

```typescript
// Client-side validation với Zod
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Cần ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Cần ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});
```

---

## 10. Responsive Design

### 10.1 Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### 10.2 Mobile-First Approach

```typescript
// Component example
const ProductGrid = ({ products }) => (
  <div className="grid 
    grid-cols-2      /* Mobile: 2 columns */
    sm:grid-cols-2   /* SM: 2 columns */
    md:grid-cols-3   /* MD: 3 columns */
    lg:grid-cols-4   /* LG: 4 columns */
    xl:grid-cols-5   /* XL: 5 columns */
    gap-4"
  >
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
```

---

## 11. Performance Optimization

### 11.1 Next.js Optimizations

```typescript
// Image Optimization
import Image from 'next/image';
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  placeholder="blur"
  loading="lazy"
/>

// Dynamic Imports
const QuickViewModal = dynamic(
  () => import('@/components/products/QuickView'),
  { loading: () => <Skeleton /> }
);

// Route Prefetching
<Link href="/products" prefetch={true}>
  Products
</Link>
```

### 11.2 Caching Strategy

```typescript
// React Query caching
const { data } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => fetchProducts(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

---

## Checklist Triển khai

### Phase 1: Foundation
- [ ] Setup Next.js project với TypeScript
- [ ] Configure Tailwind CSS
- [ ] Setup ESLint, Prettier
- [ ] Create base UI components
- [ ] Setup layout components

### Phase 2: Authentication
- [ ] Login page & logic
- [ ] Register page & logic
- [ ] Forgot/Reset password
- [ ] Auth state management
- [ ] Protected routes

### Phase 3: Products
- [ ] Product listing page
- [ ] Product detail page
- [ ] Category pages
- [ ] Search functionality
- [ ] Filters & sorting

### Phase 4: Shopping
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Order placement
- [ ] Order history

### Phase 5: User Features
- [ ] User profile
- [ ] Address management
- [ ] Wishlist
- [ ] Reviews

### Phase 6: Admin Panel
- [ ] Admin dashboard
- [ ] Product management
- [ ] Order management
- [ ] User management

### Phase 7: Polish
- [ ] Responsive design
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Testing
- [ ] Deployment

---

*Document created: January 4, 2026*
*Version: 1.0*

