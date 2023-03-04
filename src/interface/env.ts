import { MongodbConfig } from "../core/database"

enum LogLevel { combined, common, dev, tiny, none }

export interface Env {
    app: {
        hello_message: string
        clear_log: boolean
        host: string
        port: number
        log_level: keyof typeof LogLevel
        prefix: string
        max_body_size: string
        public_path: string
    }
    cors: {
        origin?: string[] | string | '*'
        allowedHeaders?: string[]
    },
    database: {
        mongodb?: {
            [index: string]: MongodbConfig
        }
    }
}