import { Express } from 'express'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import { Cb } from '../interface/function'
import { green } from 'chalk'

export const loadMiddleware = (APP: Express, proceed: Cb) => {
    APP.use(cors($env.cors))
    if ($env.app.log_level !== 'none') APP.use(morgan($env.app.log_level))
    APP.use(json({ limit: $env.app.max_body_size }))
    APP.use(urlencoded({ limit: $env.app.max_body_size, extended: true }))
    APP.use((req, res, next) => {
        req.locale = req.headers.locale as string
        
        next()
    })

    console.log(green`✔ Cors, body-parser, morgan loading successfully`)

    proceed()
}