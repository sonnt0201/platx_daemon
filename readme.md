# TCP Gateway cho hệ thống IoT Platform - Sensor Lab

## Tổng quan

`TCP Gateway` là giải pháp tiện lợi giúp đẩy dữ liệu từ các thiết bị nhúng lên server của lab (hiện tại là một Thingsboard Server) thông qua cổng TCP.

Tại sao lại là `TCP Gateway`:

- Dùng TCP (là một giao thức tầng Transport), giúp việc kết nối và gửi dữ liệu trở nên nhanh, nhẹ và tiết kiệm hơn so với các giao thức tầng application như HTTP, MQTT, ...

- Phù hợp với các thiết bị nhúng hạn chế về tài nguyên hoặc các thư viện hỗ trợ giao thức tầng app.

- Cho phép giữ kết nối lâu dài và gửi dữ liệu liên tục. Phù hợp với việc gửi dữ liệu tần số cao.

- Hỗ trợ 2 dạng dữ liệu gửi đến là `JSON` và `byte frame`. Với các project nhúng có tài nguyên phần cứng tốt, tần số gửi và dữ liệu vừa phải, sử dụng `JSON` format giúp tiện lợi trong việc tạo, cấu trúc và debug gói tin. Với các project có tài nguyên phần cứng hạn chế hơn, hoặc dữ liệu gửi đi lớn, tần số cao, có thể sử dụng `byte frame` giúp tiết kiệm dung lượng truyền.

## Tạo kết nối lâu dài (long connection) với TCP Gateway.

Đây là bước **xác thực** để gateway kiểm tra thiết bị có hợp lệ để giữ kết nối không.

TCP Gateway được thiết kế để các thiết bị nhúng có thể tạo kết nối lâu dài và gửi dữ liệu ổn định qua kết nối đó.

Để tạo và giữ kết nối với gateway, mở cổng TCP socket và gửi `string` message như sau:

```
${DEVICE_TOKEN}/json
```

hoặc 

```
${DEVICE_TOKEN}/bin
```

Với `DEVICE_TOKEN` là token cho thiết bị (device entity) đã đăng kí sẵn trên `Thingsboard Server` của lab.

Đường dẫn `/json` hoặc `/bin` định nghĩa cho gateway biết dạng dữ liệu (`JSON` hoặc `byte frame`) được gửi từ thiết bị nhúng trong suốt quá trình kết nối.

VD: `jJIuvLWdzQyAP6risLMS/json`

Nếu dạng message đúng và `DEVICE_TOKEN` hợp lệ, gateway sẽ trả về message `upgrade` thông báo đã xác thực, connection đã được upgrade và thiết bị có thể bắt đầu gửi các dữ liệu (theo dạng đã định nghĩa).

## Gửi JSON format

Sau khi tạo kết nối và xác thực xong, nếu chọn format là `JSON`, thì gateway sẽ chấp nhận các message là `JSON` từ thiết bị.

Rất đơn giản, cứ gửi gói tin string theo đúng `JSON format`, Gateway sẽ chuyển tiếp tới **device** tương ứng trên `Thingsboard server` của lab. Nội dung gói tin tùy vào bên thiết bị gửi.

**Nội dung gói tin không cần phải có thông tin về device, do device đã được định nghĩa ở bước xác thực**

Sai format, gateway sẽ trả về thông báo `wrong_format` và ngắt kết nối với thiết bị.

## Gửi byte frame format

Packet frame format (`little endian`):

### Loại 1: 

| start | 8 bytes | 1 byte | 2 bytes | 2*n bytes | 1 byte | end |
| --- | --- | --- | --- | --- | --- | --- |
|  | timestamp | label (key) | number of values (`n`)  | `n` payload values | `\0` (byte end) | |


