import { Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            allParams: () => object
        }
    }
}

const allParams = function (this: Request) {
    return { ...this.query, ...this.body }
}

export default allParams