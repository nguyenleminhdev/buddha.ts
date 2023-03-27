import { Cb, CbError } from '../interface/function'
import { eachOfLimit, waterfall } from 'async'
import { createConnection, Connection, Schema, Model } from 'mongoose'
import { createClient, RedisClient } from 'redis'
import { Client } from 'elasticsearch'
import { isArray } from 'lodash'
import { green, blue, red } from 'chalk'

/**
 * trong trường hợp deploy ở nhiều máy chủ, có khả năng sẽ sử dụng đến db nội bộ
 * của máy, mà không thể được truy cập từ bên ngoài
 * sử dụng cài đặt này để chỉ định node_name nào được phép kết nối, hạn chế việc
 * node kết nối đến một db không tiếp cập được
 */
interface NodeName {
    node_name?: string | string[]
}


//////////
// MONGODB
//////////
export interface MongodbConfig extends NodeName {
    host: string
    port: number
    name: string
}
type MongodbConnectFunction = (config: MongodbConfig, proceed: Cb) => void
type MongodbUseFunction = (
    db_name: string,
    model_name: string,
    schema: Schema
) => Model<any>
interface Mongodb {
    method: {
        connect: MongodbConnectFunction
        use: MongodbUseFunction
    },
    connection: {
        [index: string]: Connection
    }
}
// MONGODB
//////////


////////
// REDIS
////////
export interface RedisConfig extends NodeName {
    host: string
    port: number
    name: number
}
interface Redis {
    [index: string]: RedisClient
}
// REDIS
////////


////////////////
// ELASTICSEARCH
////////////////
enum ElasticsearchProtocal { http, https }
export interface ElasticsearchConfig extends NodeName {
    protocol: keyof typeof ElasticsearchProtocal
    host: string
    port: number
}
interface Elasticsearch {
    [index: string]: Client
}
// ELASTICSEARCH
////////////////


export interface Database {
    mongodb: Mongodb
    redis: Redis
    elasticsearch: Elasticsearch
}

const CHECK_NODE_NAME = (config: NodeName, proceed: Cb) => {
    if (!config.node_name) return proceed()
    if (!process.env.NODE_NAME) return proceed()
    if (process.env.NODE_NAME === config.node_name) return proceed()
    if (
        isArray(config.node_name) &&
        config.node_name.includes(process.env.NODE_NAME)
    ) return proceed()

    proceed('BLOCK')
}
const LOAD_DEFAULT_MONGODB_CONNECT = (proceed: Cb) => {
    const MONGODB: Mongodb = {
        method: {
            connect: (config, proceed) => {
                const NEW_CONNECT = createConnection(
                    `mongodb://${config.host}:${config.port}`,
                    {
                        autoIndex: true,
                        serverSelectionTimeoutMS: 5000,
                        connectTimeoutMS: 10000,
                        socketTimeoutMS: 45000,
                    }
                )

                NEW_CONNECT.on('error', e => proceed(e.message || e))

                NEW_CONNECT.on('connected', () => proceed(
                    null,
                    NEW_CONNECT.useDb(config.name, { useCache: true })
                ))
            },
            use: (
                db_name,
                model_name,
                schema
            ) => MONGODB?.connection[db_name]?.model(model_name, schema)
        },
        connection: {}
    }

    waterfall([
        (cb: CbError) => eachOfLimit( // * connect list default db
            $env.database.mongodb,
            20,
            (config, name, next) => CHECK_NODE_NAME(config, (e, r) => {
                if (e) return next()

                MONGODB.method.connect(config, (e, r) => {
                    if (e) {
                        $logging.push({
                            type: 'mongodb',
                            name: name as string,
                            address: `mongodb://${config.host}:${config.port}/${config.name}`,
                            status: '❌'
                        })

                        return next()
                    }

                    MONGODB.connection[name] = r as Connection

                    $logging.push({
                        type: 'mongodb',
                        name: name as string,
                        address: `mongodb://${config.host}:${config.port}/${config.name}`,
                        status: '✅'
                    })

                    next()
                })
            }),
            cb
        ),
        (cb: CbError) => { // * log
            console.log(blue`\t⇨ mongodb`)
            console.log(blue`\t\t⇨ basic`)
            console.log(red`\t\t❌ tenant`)

            cb()
        },
    ], e => e ? proceed(e) : proceed(null, MONGODB))
}
const LOAD_DEFAULT_REDIS_CONNECT = (proceed: Cb) => {
    const REDIS: Redis = {}
    waterfall([
        (cb: CbError) => eachOfLimit( // * connect list redis default
            $env.database.redis,
            20,
            (config, name, next) => CHECK_NODE_NAME(config, (e, r) => {
                if (e) return next()

                const URI = `redis://${config.host}:${config.port}/${config.name}`
                const NEW_CONNECT = createClient(URI)

                let error_flag: any

                NEW_CONNECT.on('error', e => {
                    if (error_flag) return

                    error_flag = e

                    $logging.push({
                        type: 'redis',
                        name: name as string,
                        address: URI,
                        status: '❌'
                    })

                    next()
                })

                NEW_CONNECT.on('ready', () => {
                    REDIS[name] = NEW_CONNECT

                    $logging.push({
                        type: 'redis',
                        name: name as string,
                        address: URI,
                        status: '✅'
                    })

                    next()
                })
            }),
            cb
        ),
        (cb: CbError) => { // * log
            console.log(blue`\t⇨ redis`)

            cb()
        }
    ], e => e ? proceed(e) : proceed(null, REDIS))
}
const LOAD_DEFAULT_ELASTICSEARCH_CONNECT = (proceed: Cb) => {
    const ELASTICSEARCH: Elasticsearch = {}
    waterfall([
        (cb: CbError) => eachOfLimit(
            $env.database.elasticsearch,
            20,
            (config, name, next) => CHECK_NODE_NAME(config, (e, r) => {
                if (e) return next()

                const URI = `${config.protocol}://${config.host}:${config.port}/`

                const NEW_CONNECT = new Client({ hosts: URI, log: false })

                NEW_CONNECT.ping({ requestTimeout: 3000 }, e => {
                    if (e) {
                        $logging.push({
                            type: 'elasticsearch',
                            name: name as string,
                            address: URI,
                            status: '❌'
                        })
                        return next()
                    }

                    ELASTICSEARCH[name] = NEW_CONNECT

                    $logging.push({
                        type: 'elasticsearch',
                        name: name as string,
                        address: URI,
                        status: '✅'
                    })

                    next()
                })
            }),
            cb
        ),
        (cb: CbError) => { // * log
            console.log(blue`\t⇨ elasticsearch`)

            cb()
        },
    ], e => e ? proceed(e) : proceed(null, ELASTICSEARCH))
}

export const loadDatabase = (proceed: Cb) => {
    console.log(green`✔ Database is loading successfully`)

    const DATA: any = {}
    waterfall([
        (cb: CbError) => LOAD_DEFAULT_MONGODB_CONNECT((e, r) => {
            if (e) return cb(e)

            DATA.mongodb = r
            cb()
        }),
        (cb: CbError) => LOAD_DEFAULT_REDIS_CONNECT((e, r) => {
            if (e) return cb(e)

            DATA.redis = r
            cb()
        }),
        (cb: CbError) => LOAD_DEFAULT_ELASTICSEARCH_CONNECT((e, r) => {
            if (e) return cb(e)

            DATA.elasticsearch = r
            cb()
        }),
        (cb: CbError) => { // * global
            globalThis.$database = DATA

            cb()
        },
    ], proceed)
}