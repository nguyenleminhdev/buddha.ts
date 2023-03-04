import { Response } from 'express'

declare global {
    namespace Express {
        interface Response {
            err: (message?: any, code?: number) => void
        }
    }
}

type Err = (this: Response, message: any, code: number) => void

const err = (function (this, message, code = 403) {
    this
        .status(code)
        .json({
            code,
            message,
            mean: $lang.t(message, this.req.locale)
        })
}) as Err

export default err