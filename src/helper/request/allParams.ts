import { Request } from 'express'

/**kiểu dữ liệu của phương thức */
type allParams = (this: Request) => any

// thêm type vào thư viện express
declare global {
    namespace Express {
        interface Request {
            /**gộp các dữ liệu của query, body và params vào một */
            allParams: allParams,
        }
    }
}

// logic của phương thức
export default (function (this) {
    return { ...this.query, ...this.body, ...this.params }
}) as allParams