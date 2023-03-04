/*******************************************************************************
 * 
 * index.ts
 *
 * Use `index.ts` to run your app in development.
 * To start the server, run: `npm run dev`.
 *
 * When use deploy to a server, use `pm2 start pm2/prod.json` instead.
 *
 * For example:
 *   => `npm run dev`               
 *   => `npm run staging`           
 *   => `npm run prod`              
 *   => `npm run build`             
 *   => `npm start`                 
 *   => `pm2 start pm2/staging.json`
 *   => `pm2 start pm2/prod.json`   
 * 
 ******************************************************************************/

import express from 'express'
import { waterfall } from 'async'

import { loadCurrentEnvConfig } from './core/env'
import { loadCustomRequestResponse } from './core/req-res'
import { loadBuddha } from './core/buddha'
import { loadBootstrap } from './core/bootstrap'
import { loadConstant } from './core/constant'
import { loadLanguage, Lang } from './core/language'
import { loadMiddleware } from './core/middleware'
import { loadDefaultEndpoint } from './core/endpoint'
import { loadServer } from './core/server'
import { loadRouter } from './core/router'
import { loadDatabase, Database } from './core/database'
import { loadStatic } from './core/static'
import { loadSocket } from './core/socket'

import { Env } from './interface/env'
import { Constant } from './interface/constant'
import { CbError } from './interface/function'

declare global {
    namespace Express {
        interface Request {
            [index: string]: () => object
            locale: string
        }
        interface Response {
            [index: string]: (output?: any, code?: number) => void
        }
    }
    var $logging: Array<{
        type: string
        name: string
        address: string
    }>
    var $env: Env
    var $constant: Constant
    var $lang: Lang
    var $database: Database
}

const APP = express()
const ROUTER = express.Router()
globalThis.$logging = []

console.clear()

waterfall([
    (cb: CbError) => loadCurrentEnvConfig(cb),
    (cb: CbError) => loadConstant(cb),
    (cb: CbError) => loadLanguage(cb),
    (cb: CbError) => loadDatabase(cb),
    (cb: CbError) => loadMiddleware(APP, cb),
    (cb: CbError) => loadStatic(APP, cb),
    (cb: CbError) => loadCustomRequestResponse(cb),
    (cb: CbError) => loadRouter(APP, ROUTER, cb),
    (cb: CbError) => loadBootstrap(cb),
    (cb: CbError) => loadDefaultEndpoint(APP, cb),
    (cb: CbError) => loadSocket(cb),
    (cb: CbError) => loadServer(APP, cb),
    (cb: CbError) => loadBuddha(cb),
], e => { if (e) console.log('START SERVER ERROR::', e) })