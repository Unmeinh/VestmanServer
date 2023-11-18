Đây là server của dự án ứng dụng Vestman.

# Getting Started

>**Note**: Chắc chắn rằng bạn đã chạy server với localhost.

## Step 1: Khởi chạy server

Để khởi chạy server ở localhost, hãy vào thư mục chính của dự án và mở cửa sổ lệnh. Sau đó điền câu lệnh như dưới đây:

```bash
# using npm
npm start

```

## Step 2: Đăng nhập vào hệ thống
Mở trình duyệt của bạn và mở đường dẫn
http://localhost:3000/

Đầu tiên, hệ thống server của Vestman phân chia ra thành 3 quyền tương ứng với admin. 
1. Owner là người có mọi quyền hành trong server.
2. Manager là người quản lý trên server nhưng không có quyền tác động đến admin.
3. Participant là người chỉ có thể xem bảng và xem chi tiết dữ liệu, không có quyền chỉnh sửa vào dữ liệu của server.

Yên tâm đi vì chúng tôi sẽ cung cấp tài khoản cho bạn dùng thử:

### For Admin Owner

```bash
# Hoàng Linh
username hoangLinh
password 123456789

```

### For Admin Manager

```bash
# Tiến Giỏi
username gioiTran
password 123456789

# Văn Cao
username cao
password 1
```

### For Admin Participant

```bash
# Nhật Phúc
username nhatphuc
password 123456

# Văn Trọng
username vantrong
password 123456

# Việt Hoàng
username viethoang
password 123456
```

## Step 3: Giờ thì sao?

Sau khi bạn đã đăng nhập thành công. Tùy vào phân quyền mà bạn có thì bạn sẽ có thể sử dụng chứng năng tương ứng ở trên server.

Chúc bạn có thời gian thoải mái khi sử dụng VestmanServer.