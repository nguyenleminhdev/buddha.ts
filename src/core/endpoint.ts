import { Express, Request, Response, NextFunction } from 'express'
import { Cb } from '../interface/function'
import { green } from 'chalk'

type Function500 = (
    err: Error,
    req: Request,
    res: Response,
    proceed: NextFunction
) => void

export const loadDefaultEndpoint = (APP: Express, proceed: Cb) => {
    APP.get('/', (req, res) => res.ok($env.app.hello_message))

    APP.use((req, res, proceed) => res.err('COMMON.NOT_FOUND.API', 404))

    APP.use((
        (e, req, res, proceed) => res.err(e.message || e, 500)
    ) as Function500)

    console.log(green`✔ Default endpoint loading successfully`)

    proceed()
}