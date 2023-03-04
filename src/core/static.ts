import express, { Express } from 'express'
import { Cb } from '../interface/function'

export const loadStatic = (APP: Express, proceed: Cb) => {
    APP.use(express.static(
        `${process.cwd()}/${$env.app.public_path}`,
        {
            setHeaders: function setHeaders(res, path, stat) {
                res.header('Access-Control-Allow-Origin', '*')
            }
        }
    ))

    $logging.push({
        type: 'server',
        name: 'static',
        address: `http://${$env.app.host}:${$env.app.port}/*`
    })

    console.log(`✔ Server static loading successfully`)

    proceed()
}