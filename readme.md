# IoT Platform Extension: DAEMON

## Tổng quan

IoT Platform là dự án phát triển nền tảng IoT cho Sensor Lab. Mục đích nhằm đưa ra nền tảng chung để hứng 
các dữ liệu đẩy lên từ phần cứng của các nhóm trong lab. Đồng thời đưa ra các công cụ cơ bản quản lý, truy xuất dữ liệu và điều khiển thiết bị.

IoT Platform sử dụng nền tảng **Thingsboard**.

**IoT PlatX: DAEMON** cung cấp các service chạy nền mở rộng mà Thingsboard bản Community vốn không hỗ trợ,
VD (TCP Gateway, Bộ đặt lịch).

**DAEMON** được tổ chức thành các service độc lập, cung cấp các HTTP API Router để làm giao diện sử dụng các service.

## Cài đặt

### Điều kiện tiên quyết:

Yêu cầu máy tính có môi trường:

NodeJS (từ 20.18 trở lên)

Git (từ 2.34 trở lên)

### Các bước

Clone Repo 

```shell
git clone https://github.com/sonnt0201/platx_daemon
```
Chuyển hướng tới thư mục `platx_daemon` và chạy install

```shell
cd platx_daemon
npm install
```

Tạo file lưu các biến môi trường.

- Trong thư mục `platx_daemon`, tạo file tên là `.env`

- Điền nội dung sau vào file `env`

```shell
# port for tcp server
TCP_GW_PORT=2828 
PORT=2828

# HTTP exposed master API port
HTTP_API_PORT=1212

THINGSBOARD_HOST="http://tbc7.hust-2slab.org:8080"

# thingsboard auth, "TB" as thingsboard
TB_AUTH_USERNAME="YOUR_TENANT_USERNAME"
TB_AUTH_PASSWORD="YOUR_TENANT_PASSWORD"

```

Thay `YOUR_TENANT_USERNAME` và `YOUR_TENANT_PASSWORD` bằng tài khoản username password của tenant.



Sau đó, `build` bản product

```shell

npm run build
```

Chạy DAEMON

```shell
npm start
```

## Các service cung cấp

## TCP Gateway 

(Chưa có nội dung)

## Scheduler

(chưa có nội dung)

***

12/2024 by Thai-Son Nguyen

🧑‍💻🧑‍💻🧑‍💻 Happy coding !!! 🧑‍💻🧑‍💻🧑‍💻

```brainfuck
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⡇⠉⠓⠦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣷⣶⣦⣤⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣛⠿⣿⣶⣦⣄⡀⠀⠀⠇⠀⠀⠀⠀⠑⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⠙⠿⣿⣿⣿⣿⣿⡿⣯⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣌⠻⣿⣿⣿⣦⣰⠀⠀⠀⠀⠀⡜⢁⣀⣀⣀⣀⣀⣤⣤⣤⡄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⡀⠀⠺⣿⣿⣿⢯⣾⣿⣿⣿⣿⣿⢿⣛⣛⣛⣛⣛⣛⣛⡿⢿⣿⣿⣷⡜⣿⣿⣿⡿⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⠇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠹⣿⡟⣾⣿⣿⣿⣿⡿⢾⣿⡿⠿⠿⣿⣿⣿⣿⣿⣷⣮⣝⢿⣷⢹⣿⣿⠗⠁⠀⣠⣿⣿⣿⣿⣿⣿⢿⣿⣿⡿⢫⡎⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢆⠀⠀⢈⣿⣿⠿⠛⠋⠁⠀⠁⠀⠀⠀⠀⠀⠙⠉⠛⠛⠛⠻⢿⣿⣿⣾⣟⣁⠠⠴⢾⣿⣿⡿⠿⠟⠛⠁⢸⣿⠏⠀⣼⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⣴⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣏⠀⠈⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠁⠀⣸⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⡟⠀⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠀⠙⣶⣾⣷⣦⣄⣀⣀⠀⠀⠀⢀⡜⠀⢀⡼⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡿⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⣾⣿⢿⣿⣯⢻⣿⣿⣿⣯⠉⠀⢠⡞⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠁⠐⢀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣼⣿⣿⡎⣿⡿⣿⣧⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠈⠉⠐⠤⡀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣠⣴⠿⠛⠛⠛⠛⠲⣄⠀⠀⠀⠀⠀⠀⢐⣶⠶⣶⣶⣤⡀⡀⠂⠀⣿⣿⣿⣿⣿⣷⢿⣿⡹⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⠀⠀⠀⠈⢢⡀⠀⠀⠀⠉⠓⢩⣽⡝⠁⣀⠄⠀⠒⠒⢀⠈⠃⠀⠀⠀⠀⠈⠁⡀⠀⠠⢀⡈⠉⠳⣄⠀⣿⣿⣿⣿⣿⣿⢸⣿⣷⢻⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠺⡖⡂⠀⠀⠀⠱⡀⠀⠀⠀⠀⢸⣿⠀⢸⠁⡠⠀⠂⠀⠀⠂⠀⠀⠀⠀⠀⣠⠊⡀⠀⠄⠀⠀⠑⡄⠈⢷⣿⡟⠘⢛⣛⣿⡼⣿⣿⣏⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠶⣧⡄⠀⠀⠀⠇⠀⠀⠀⠀⢸⣿⡇⠸⡀⠁⠒⣇⠀⠀⢸⠀⠀⠀⠀⠀⠇⠀⠣⢤⡂⠀⠀⠀⢰⠀⠀⣿⣿⢸⣿⣿⣿⡇⣿⣿⣿⢹⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠁⠀⠀⠀⠀⡄⠀⠀⠀⠀⢸⣿⠇⣠⡀⠀⠀⢀⣀⠤⠂⠀⠀⠀⠀⠀⠐⠀⠀⠀⠁⠀⠀⠀⠸⠀⠀⣿⡏⣿⣿⣿⣿⡇⣿⣿⣿⡏⣿⣿⣷⣀⠀⠀⠀⠀⠀⠀
⠀⠭⢤⠀⠀⠀⣠⠃⠀⠀⣠⠎⢉⠙⢳⠒⠒⠤⢤⣈⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠤⢐⡡⠀⠀⣿⢇⣿⣿⣿⣿⡇⣿⣿⣿⣇⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀
⠀⠀⠚⢀⣠⠆⠉⠁⠀⢠⠃⢠⠂⢀⠇⠀⡀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠀⡐⠉⠑⠒⠉⢀⠝⣿⣀⠀⢀⣿⢸⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀
⠶⠶⠚⠋⠁⠀⠀⠀⠀⢸⠀⢸⣀⢸⠀⠀⡧⠤⠄⠀⠀⣀⡀⠀⠀⠀⠀⠸⠀⢰⠰⠀⠀⣼⡋⣫⠦⢠⣼⣏⣿⣿⣿⣿⣿⢗⣿⣿⢹⣿⣿⠙⢿⣿⣿⣿⣿⣿⣿⣦
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢦⣀⠓⣤⣦⣀⣨⣦⣒⣈⣉⠁⠀⠀⠀⠀⠒⢇⠀⠸⡆⠀⠀⠙⠸⣏⣠⠟⣹⣿⣿⣿⣿⡿⣫⣿⣿⣿⢸⣿⣿⣧⠀⠙⢿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⡿⣿⣿⣿⣿⣿⣿⢿⣿⠟⠉⠉⠙⢷⡆⠚⠦⠤⠜⢄⡀⠀⣠⠏⢀⣼⣿⣿⣿⣿⢻⢪⣿⣿⣿⣿⢸⣿⣿⣿⣧⡀⠈⠻⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⠟⣫⣾⣿⢫⣿⣿⡿⣻⠿⡅⠀⠀⠀⠀⠀⠑⠄⣠⠔⠊⠁⠈⠉⢁⣴⣿⣿⣿⣿⢟⣵⡟⣾⣿⣿⣿⣿⣼⣿⣿⣿⣿⣿⣄⠀⠹⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢰⣿⣵⣾⣿⡟⣵⣿⣿⢟⣾⡟⠀⠱⡀⠀⠀⠀⠀⠠⠚⠁⠀⠀⠀⢀⣴⣿⣿⣿⣿⡿⣳⣿⣿⣸⣿⣿⣿⣿⡇⢿⣿⣿⣿⣿⣿⣿⣧⠀⢹⣿⣿
⠀⠀⠀⣀⣤⣶⣾⣿⣿⣿⡿⣫⣾⣿⣿⢫⣾⢟⠅⡀⡴⡘⢆⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⢏⣾⣿⣿⣇⣿⣿⣿⣿⣿⡇⣷⡻⣿⣿⣿⣿⣿⣿⣇⠈⣿⣿
⠀⣤⣾⣿⣿⣿⣿⣿⡿⣿⣾⣿⣿⣿⢏⣿⡇⠡⠊⡜⠀⠈⢆⠑⢦⡀⢀⡠⠒⢉⣾⣿⣿⣿⣿⣿⢫⣾⣿⣿⣿⢹⣿⣿⣿⣿⣿⣇⣿⣷⡹⣿⣿⣿⣿⣿⣿⣤⣿⣿
⢸⣿⣿⣿⣿⣿⠟⠁⣼⣿⣿⣿⡟⣵⣿⣿⣿⡀⡜⠀⠀⡀⠀⠃⠠⢋⠅⠈⠀⣾⣿⣿⣿⣿⣿⢳⢻⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⡸⣿⣷⠹⣛⣛⣭⣭⣭⣽⣿⣿
⢸⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣾⣄⠀⠇⠐⠀⠀⠀⠪⠢⡘⣿⣿⣿⣿⣿⢣⣿⣮⢿⣿⣿⣿⣼⣿⣿⣿⣿⣿⣿⣿⡻⢿⣧⢻⣿⣿⣿⣿⣿⣿⣿
⢸⣿⣿⣿⣿⣧⠀⣿⣿⣿⣿⣿⡏⣿⣿⣿⣿⣿⣿⣌⠙⠚⠒⠦⣄⠤⠒⠒⢲⣽⣿⣿⣿⣿⢸⣿⣿⣿⣮⡻⣿⣷⡻⣿⣿⣿⣿⣿⣿⣿⣷⣮⣙⠿⣿⣿⣿⣿⣿⣿

```