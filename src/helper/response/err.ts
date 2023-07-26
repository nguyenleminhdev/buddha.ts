import { Response } from 'express'

/**kiểu dữ liệu của phương thức */
type err = (
    this: Response, 
    /**thông điệp lỗi */
    message?: any, 
    /**http code, mặc định là 403 */
    code?: number, 
    /**dữ liệu lỗi thêm */
    payload?: any
) => void

// thêm type vào thư viện express
declare global {
    namespace Express {
        interface Response {
            /**sử dụng để trả về khi xảy ra lỗi */
            err: err
        }
    }
}

// logic của phương thức
export default (function (this, message, code = 403, payload) {
    this
        .status(code)
        .json({
            code,
            message,
            mean: $lang.t(message, this.req.locale),
            payload
        })
}) as err