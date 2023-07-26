import { Response } from 'express'

/**kiểu dữ liệu của phương thức */
type ok = (
    this: Response, 
    /**dữ liệu trả về */
    data?: any, 
    /**http code mặc định 200 */
    code?: number
) => void

// thêm type vào thư viện express
declare global {
    namespace Express {
        interface Response {
            /**sử dụng để trả về kết quả khi thành công */
            ok: ok
        }
    }
}

// logic của phương thức
export default (function (this, data, code = 200) {
    this.status(code).json({ code, data })
}) as ok