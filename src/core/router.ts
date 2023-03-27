import { Cb, CbError } from '../interface/function'
import { Controller } from '../interface/api'
import { Express, Router } from 'express'
import { readdirSync, lstat } from 'fs'
import { eachOfLimit, waterfall } from 'async'
import { join } from 'path'
import { keyBy, get, map } from 'lodash'
import { Middleware } from '../interface/api'
import middleware from '../config/middleware'
import { green, blue } from 'chalk'

interface PathData {
    full_path: string
    path: string
}
interface SourceItem {
    [index: string]: Controller
}
interface SourceData extends PathData {
    // source: { [index: string]: Controller }
    // default: { [index: string]: Controller }
    source: SourceItem
    default: SourceItem
}
interface ControllerData {
    path: string
    controller: Controller
}

const GLOB_ALL = (root_path: string, proceed: Cb) => {
    const RESULT: PathData[] = []

    const GLOB = (path: string, proceed: Cb) => {
        eachOfLimit(
            readdirSync(path),
            1,
            (name, i, next) => {
                const CURRENT_PATH = `${path}/${name}`

                lstat(CURRENT_PATH, (e, r) => {
                    if (e) return next(e)

                    if (r.isDirectory()) return GLOB(CURRENT_PATH, next)

                    RESULT.push({
                        full_path: CURRENT_PATH,
                        path: CURRENT_PATH
                            .replace(root_path, '')
                            .replace('.ts', '')
                            .replace('.js', '')
                            .replace(/index/g, ''),
                    })

                    next()
                })
            },
            proceed
        )
    }

    GLOB(root_path, e => e ? proceed(e) : proceed(null, RESULT))
}
const loadMiddleware = (ROUTER: Router, proceed: Cb) => {
    const PATH = `${__dirname}/../api/middleware`

    const DATA: {
        list_middleware: {
            [index: string]: {
                name: string
                source: { default: Middleware }
            }
        }
    } = {
        list_middleware: {}
    }
    waterfall([
        (cb: CbError) => Promise.all(
            readdirSync(PATH).map(async n => {
                return {
                    name: n.replace('.ts', '').replace('.js', ''),
                    source: await import(join(PATH, n))
                }
            })
        ).then(n => {
            DATA.list_middleware = keyBy(n, 'name')

            cb()
        }),
        (cb: CbError) => eachOfLimit(middleware, 1, (v, k, next) => {
            const LIST_HANDLE = v.map(
                n => get(DATA.list_middleware, [n, 'source', 'default'])
            ).filter(n => n)

            if (!LIST_HANDLE.length) return next()

            ROUTER.use(join('/', k as string), ...LIST_HANDLE)

            next()
        }, cb)
    ], proceed)
}

const handleController = (path: string, source: SourceItem, proceed: Cb) => {
    const DATA: {
        controller_list: ControllerData[]
    } = {
        controller_list: []
    }
    eachOfLimit(
        source,
        1,
        (controller, i, next) => {
            DATA.controller_list.push({
                path: join(path, controller.name.replace(/index/g, '')),
                controller
            })

            next()
        },
        e => e ? proceed(e) : proceed(null, DATA.controller_list)
    )
}
const handleControllerList = (input: SourceData, proceed: Cb) => {
    const DATA: {
        controller_list: ControllerData[]
    } = {
        controller_list: []
    }
    waterfall([
        (cb: CbError) => handleController( // * export const
            input.path,
            input.source,
            (e, r: ControllerData[]) => {
                if (e) return cb(e)

                DATA.controller_list = [...DATA.controller_list, ...r]
                cb()
            }
        ),
        (cb: CbError) => handleController( // * export default
            input.path,
            input.default,
            (e, r: ControllerData[]) => {
                if (e) return cb(e)

                DATA.controller_list = [...DATA.controller_list, ...r]
                cb()
            }
        ),
    ], e => e ? proceed(e) : proceed(null, DATA.controller_list))
}
const loadController = (ROUTER: Router, proceed: Cb) => {
    const DATA: {
        path_list: PathData[]
        source_list: SourceData[]
        controller_list: ControllerData[]
    } = {
        path_list: [],
        source_list: [],
        controller_list: [],
    }
    waterfall([
        (cb: CbError) => GLOB_ALL(
            `${__dirname}/../api/controller`,
            (e, r) => {
                if (e) return cb(e)

                DATA.path_list = r
                cb()
            }
        ),
        (cb: CbError) => Promise.all(DATA.path_list.map(async r => {
            const SOURCE = await import(r.full_path)
            const DEFAULT = SOURCE.default || {}
            delete SOURCE.default

            return { ...r, ...{ source: SOURCE, default: DEFAULT } }
        })).then(r => {
            DATA.source_list = r

            cb()
        }),
        (cb: CbError) => eachOfLimit( // * handle list source
            DATA.source_list,
            1,
            (source_data, i, next) => handleControllerList(
                source_data,
                (e, r: ControllerData[]) => {
                    if (e) return next(e)

                    DATA.controller_list = [...DATA.controller_list, ...r]
                    next()
                }
            ),
            cb
        ),
        (cb: CbError) => eachOfLimit(DATA.controller_list, 1, (n, i, next) => {
            ROUTER.all(n.path, n.controller)

            next()
        }, cb)
    ], e => {
        if (e) return proceed(e)

        proceed(null, DATA.controller_list)
    })
}

export const loadRouter = (APP: Express, ROUTER: Router, proceed: Cb) => {
    const DATA: {
        controller_list: ControllerData[]
    } = {
        controller_list: []
    }
    waterfall([
        (cb: CbError) => loadMiddleware(ROUTER, cb),
        (cb: CbError) => loadController(ROUTER, (e, r) => {
            if (e) return cb(e)

            DATA.controller_list = r
            cb()
        }),
        (cb: CbError) => { // * prefix
            APP.use(`/${$env.app.prefix}`, ROUTER)

            cb()
        },
        (cb: CbError) => { // * log
            console.log(green`✔ Middleware loading successfully`)

            map(middleware, (v, k) => console.log(blue`\t⇨ ${v.join(' >> ')} >> ${k}`))

            console.log(green`✔ Api loading successfully`)

            DATA.controller_list.map(n => console.log(blue`\t⇨ ${n.path}`))

            cb()
        },
    ], proceed)
}