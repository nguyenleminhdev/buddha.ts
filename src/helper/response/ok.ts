import { Response } from 'express'

declare global {
    namespace Express {
        interface Response {
            ok: (data?: any, code?: number) => void
        }
    }
}

type Ok = (this: Response, data: any, code: number) => void

const ok = (function (this, data, code = 200) {
    this.status(code).json({ code, data })
}) as Ok

export default ok