import { createServer } from 'http'
import { Express } from 'express'
import { Cb } from '../interface/function'
import { green } from 'chalk'

export const loadServer = (APP: Express, proceed: Cb) => {
    /**
     * ưu tiên ghi đè host, port ở env config của pm2
     * sau đó mới đến config của env
     */
    const HOST = process.env.HOST || $env.app.host || '0.0.0.0'
    const PORT = process.env.PORT || $env.app.port || 1337

    createServer(APP)
        .listen(PORT as number, HOST, () => {
            $logging.push({
                type: 'server',
                name: 'static',
                address: `http://${HOST}:${PORT}/*`,
                status: '✅'
            })

            $logging.push({
                type: 'server',
                name: 'http',
                address: `http://${HOST}:${PORT}/${$env.app.prefix}/*`,
                status: '✅'
            })

            console.log(green`✔ Server static loading successfully`)

            console.log(green`✔ Http server loading successfully`)

            proceed()
        })
        .on('error', proceed)
}