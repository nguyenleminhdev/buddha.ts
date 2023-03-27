import { Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            allParams: () => object
        }
    }
}

const allParams = function (this: Request) {
    return {
        /**
         * querystring data in url:
         * ?param_1=something&param_2=someone
         */
        ...this.query,

        /**
         * data json parser of list content-type: 
         * application json | application/x-www-form-urlencoded | form data
         */
        ...this.body,

        /**
         * string data in url: /something/:variable_1/:variable_2
         */
        ...this.params
    }
}

export default allParams