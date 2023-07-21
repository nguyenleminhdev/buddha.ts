import { Lang } from '../interface/language'

const LANG: Lang = {
    PING: 'pong',
    SUCCESS: 'Thành công',
    ACCESS_DENIED: 'Truy cập bị từ chối',
    NOT_FOUND: {
        DATA: 'Không tìm thấy dữ liệu',
        API: 'Api không tồn tại',
        USER: 'Không tim thấy người dùng',
        ACCESS_TOKEN: 'Không tìm thấy mã thông báo',
    },
    MISSING: {
        DATA: 'Bạn nhập thiếu dữ liệu'
    },
    REQUIRE: {
        ACCESS_TOKEN: 'Yêu cầu mã thông báo truy cập',
        EMAIL: 'Yêu cầu email',
        PASSWORD: 'Yêu cầu mật khẩu',
        USER_ID: 'Yêu cầu id người dùng',
    },
    EXPIRED: {
        ACCESS_TOKEN: 'Mã thông báo đã hết hạn'
    },
}

export default LANG