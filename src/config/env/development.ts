import { Env } from '../../interface/env'

const ENV: Env = {
    app: {
        hello_message: 'Buddha.ts loading successfully',
        clear_log: false,
        host: '0.0.0.0',
        port: 1337,
        log_level: 'dev',
        prefix: 'v1',
        max_body_size: '1mb',
        public_path: 'public'
    },
    cors: {
        origin: ['http://localhost:8000', 'https://botbanhang.vn'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    database: {
        mongodb: {
            name_of_db: {
                host: '0.0.0.0',
                port: 27017,
                name: 'name_of_db'
            }
        }
    }
}

export default ENV