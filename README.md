# Họ tên: NGUYEN NGOC DUC TRUNG | MSSV: 23661481 | URL: https://github.com/AnTonyTrung/23661481_TH2.git | Stamp: #874523 | Số cuối: 1 | VARIANT: Watermark Dưới, Phone Auth, ShopFirst, Selection Haptic, Phí B, Detail Card

# KTXGo - Ứng dụng Giao đồ tận phòng KTX

Dự án bài thi thực hành 2 (TH2) môn **Lập Trình Cho Thiết Bị Di Động**.

## 1. Thông Tin Sinh Viên & Biến Thể
- **Họ và tên:** NGUYỄN NGỌC ĐỨC TRUNG
- **MSSV:** 23661481
- **Chữ số cuối MSSV:** 1
- **Seed:** 481
- **Exam Stamp:** #874523
- **Thứ tự Tab:** Shop → Giỏ → Tôi (`shopFirst`)
- **Ô Login:** Số điện thoại (`phone`)
- **Watermark:** Dưới cùng (`watermarkAtTop: false`)
- **Phản hồi xúc giác (Haptic):** `selection`
- **Công thức phí ship:** B (`BASE_SHIP_FEE + Math.round(km * 1500) + 2000`)
- **Màn hình chi tiết (Detail):** Dạng thẻ `card`
- **Phòng giao hàng:** `P.181`
- **Tên package:** `ktxgo-23661481`
- **Persist key giỏ hàng:** `ktxgo-cart-23661481`

## 2. Công Nghệ Bắt Buộc Sử Dụng
- **React Native CLI + TypeScript**
- **FlashList (Shopify):** Lưới 2 cột (`numColumns={2}`)
- **React Navigation V7:** Stack + Bottom Tabs + Safe Area Context
- **Zustand + AsyncStorage:** Quản lý trạng thái giỏ hàng & đăng nhập với tính năng Persist
- **TanStack Query (React Query) + Axios:** Fetch dữ liệu món ăn, caching, xử lý 3 trạng thái mạng
- **Location + Haptic:** Định vị GPS, tính khoảng cách Haversine, 3 nhánh quyền (granted, denied, blocked mở Settings), phản hồi rung

## 3. Ảnh Chụp Màn Hình
- Home Screen: `docs/screenshot-th2-home.png`
- Cart Screen: `docs/screenshot-th2-cart.png`
