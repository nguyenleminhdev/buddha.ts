import { createServer } from 'http'
import { Express } from 'express'
import { Cb } from '../interface/function'

export const loadServer = (APP: Express, proceed: Cb) => {
    createServer(APP)
        .listen($env.app.port, $env.app.host, () => {
            $logging.push({
                type: 'server',
                name: 'http',
                address: `http://${$env.app.host}:${$env.app.port}/${$env.app.prefix}/*`
            })

            console.log(`✔ Http server loading successfully`)

            proceed()
        })
        .on('error', proceed)
}