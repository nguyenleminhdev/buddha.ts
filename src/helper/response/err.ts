import { Response } from 'express'

declare global {
    namespace Express {
        interface Response {
            err: (message?: any, code?: number, payload?: any) => void
        }
    }
}

type Err = (this: Response, message: any, code: number, payload: any) => void

const err = (function (this, message, code = 403, payload) {
    this
        .status(code)
        .json({
            code,
            message,
            mean: $lang.t(message, this.req.locale),
            payload
        })
}) as Err

export default err