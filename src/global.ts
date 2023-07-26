/**
 * - khai báo kiểu dữ liệu cho các biến toàn cục
 * - chỉnh sửa kiểu dữ liệu của thư viên
 */

import type { Env, Constant } from './interface'
import type { Lang } from 'buddha-core'

declare global {
    /**giá trị các cài đặt của môi trường hiện tại */
    var $env: Env
    /**giá trị các cài đặt các môi trường dùng chung */
    var $constant: Constant
    /**các cài đặt của i18n */
    var $lang: Lang<Env>
}