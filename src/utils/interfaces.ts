interface ZaloPayOrder {
    app_id: string | number; // Định danh ứng dụng
    app_user: string | number; // Thông tin định danh người dùng
    app_trans_id: string; // Mã giao dịch, format yymmddMã đơn hàng
    app_time: number; // Thời gian tạo đơn hàng (timestamp ms)
    expire_duration_seconds?: number; // Thời gian hết hạn đơn hàng (giây)
    amount: number; // Giá trị đơn hàng (VND)
    item: { 
      itemid: string;
      itename: string;
      itemprice: number;
      itemquantity: number;
    }[] | string; // Danh sách sản phẩm
    description: string; // Mô tả đơn hàng
    embed_data: string; // Dữ liệu riêng của đơn hàng (JSON string)
    bank_code?: string; // Mã ngân hàng
    mac?: string; // Thông tin chứng thực đơn hàng
    callback_url?: string; // URL callback khi thanh toán hoàn tất
    device_info?: string; // Thông tin thiết bị (JSON string)
    sub_app_id?: string; // Định danh dịch vụ phụ (nếu có)
    title?: string; // Tiêu đề đơn hàng
    currency?: string; // Đơn vị tiền tệ (mặc định VND)
    phone?: string; // Số điện thoại người dùng
    email?: string; // Email người dùng
    address?: string; // Địa chỉ người dùng
  }
  