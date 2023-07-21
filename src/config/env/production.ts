import { Env } from '../../interface/env'

const ENV: Env = {
    app: {
        hello_message: 'CHATBOX-SERVER loading successfully',
        clear_log: true,
        host: '0.0.0.0',
        port: 1337,
        log_level: 'none',
        prefix: 'v1',
        max_body_size: '1mb',
        public_path: 'public',
        time_zone: 'Asia/Ho_Chi_Minh'
    },
    cors: {
        // origin: [
        //     'http://localhost:8000',
        //     'https://localhost:8000',
        // ],
        // allowedHeaders: ['Content-Type', 'Authorization', 'locale']
    },
    database: {
        mongodb: {
            db_1: {
                host: '0.0.0.0',
                port: 27017,
                name: 'db_1',
            },
        },
        redis: {
            db_1: {
                host: '0.0.0.0',
                port: 6379,
                name: 0
            }
        },
        elasticsearch: {
            db_1: {
                host: '0.0.0.0',
                protocol: 'http',
                port: 9200
            }
        },
    },
    jwt: {
        secret_key: '123456',
        expired: 1000 * 60 * 60 * 24 * 365 * 100
    }
}

export default ENV