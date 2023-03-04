import { Cb, CbError } from '../interface/function'
import { waterfall } from 'async'
import { createConnection, Connection, Schema, Model } from 'mongoose'
import { map } from 'lodash'

export interface MongodbConfig {
    host: string
    port: number
    name: string
}
type MongodbConnectFunction = (config: MongodbConfig) => Connection
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
export interface Database {
    mongodb: Mongodb
}

const LOAD_DEFAULT_MONGODB_CONNECT = (proceed: Cb) => {
    const MONGODB: Mongodb = {
        method: {
            connect: config => {
                return createConnection(
                    `mongodb://${config.host}:${config.port}`,
                    {
                        autoIndex: true,
                        serverSelectionTimeoutMS: 5000,
                        connectTimeoutMS: 10000,
                        socketTimeoutMS: 45000,
                    }
                ).useDb(config.name, { useCache: true })
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
        (cb: CbError) => { // * connect list default db
            map(
                $env.database.mongodb,
                (v, k) => {
                    MONGODB.connection[k] = MONGODB.method.connect(v)

                    $logging.push({
                        type: 'mongodb',
                        name: k,
                        address: `mongodb://${v.host}:${v.port}/${v.name}`,
                    })
                }
            )

            cb()
        },
        (cb: CbError) => { // * log
            console.log(`\t⇨ mongodb`)
            console.log(`\t\t⇨ basic`)
            console.log(`\t\t❌ tenant`)

            cb()
        },
    ], e => e ? proceed(e) : proceed(null, MONGODB))
}

export const loadDatabase = (proceed: Cb) => {
    console.log(`✔ Database is loading successfully`)

    const DATA: any = {}
    waterfall([
        (cb: CbError) => LOAD_DEFAULT_MONGODB_CONNECT((e, r) => {
            if (e) return cb(e)

            DATA.mongodb = r
            cb()
        }),
        (cb: CbError) => {
            console.log(`\t❌ redis`)

            cb()
        },
        (cb: CbError) => {
            console.log(`\t❌ elasticsearch`)

            cb()
        },
        (cb: CbError) => { // * global
            globalThis.$database = DATA

            cb()
        },
    ], proceed)
}