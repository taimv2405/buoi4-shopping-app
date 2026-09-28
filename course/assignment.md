Xây dựng hệ thống navigation cho một ứng dụng bán hàng, chọn một trong hai hướng: **Cách 1: React Navigation** hoặc **Cách 2: Expo Router**. Hai cách phải đạt cùng hành vi và trải nghiệm, chỉ khác cách tổ chức route.

Ứng dụng gồm: Home, Search, Profile, Edit Profile, Product Details, Create Review. Yêu cầu:
- Home, Search, Profile là các destination chính.
- Profile → Edit Profile là drill-down flow.
- Product Details mở **bên ngoài primary navigation** (không còn Bottom Tabs khi xem chi tiết).
- Create Review là **modal toàn cục**, mở được từ nhiều màn hình.
- Home/Search dùng danh sách từ dữ liệu mẫu.
- Product Details nhận `productId` và `source`, không truyền toàn bộ Product object.
- Từ Product Details có thể mở sản phẩm liên quan; Back phải quay lại đúng sản phẩm trước đó.
- Header của Product Details thay đổi theo sản phẩm hiện tại.
- Edit Profile cảnh báo khi rời màn hình lúc còn thay đổi chưa lưu.
- Cửa sổ rộng: primary navigation chuyển từ Bottom Tabs sang sidebar/rail phù hợp nhưng **không đổi route semantics**.

Dữ liệu mẫu:
```ts
export const products = [
  { id: 'P-101', name: 'React Native Handbook', price: 249000 },
  { id: 'P-102', name: 'TypeScript in Practice', price: 199000 },
  { id: 'P-103', name: 'Mobile UI Design', price: 289000 },
  { id: 'P-104', name: 'JavaScript Patterns', price: 219000 },
  { id: 'P-105', name: 'Clean Architecture', price: 319000 },
  { id: 'P-106', name: 'API Design Guide', price: 179000 },
  { id: 'P-107', name: 'React Performance', price: 269000 },
  { id: 'P-108', name: 'UX for Mobile Apps', price: 229000 },
  { id: 'P-109', name: 'Testing React Native', price: 259000 },
  { id: 'P-110', name: 'Modern Navigation', price: 189000 },
  { id: 'P-111', name: 'State Management', price: 239000 },
  { id: 'P-112', name: 'Cross-platform Apps', price: 299000 },
];
```
- Tham khảo cách làm: https://drive.google.com/file/d/1uwFUFYw9Kpm2lUojZnX2GCLszPq_Iquo/view?usp=sharing
- Nộp bài trên website môn học.
