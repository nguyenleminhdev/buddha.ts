/**
 * - khai báo kiểu dữ liệu cho các biến toàn cục
 * - chỉnh sửa kiểu dữ liệu của thư viên
 */

import type { Env, Constant } from './interface'
import type { Lang, Database, Queue } from 'buddha-core'

declare global {
    // chỉnh sửa kiểu dữ liệu của thư viện express
    namespace Express {
        // thêm thuộc tính vào request
        interface Request {
            [index: string]: () => object

            /**giá trị của i18n được api truyền lên */
            locale: string
        }
        // thêm thuộc tính vào response
        interface Response {
            [index: string]: (output?: any, code?: number, payload?: any) => void
        }
    }
    /**giá trị các cài đặt của môi trường hiện tại */
    var $env: Env
    /**giá trị các cài đặt các môi trường dùng chung */
    var $constant: Constant
    /**các cài đặt của i18n */
    var $lang: Lang<Env>
    /**các đối tượng dùng để kết nối đến CSDL */
    var $database: Database
    /**các phương thức của hàng đợi */
    var $queue: {
        [index: string]: Queue
    }
}