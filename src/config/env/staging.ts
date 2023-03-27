import { Env } from '../../interface/env'

const ENV: Env = {
    app: {
        hello_message: 'SERVER loading successfully',
        clear_log: true,
        host: '0.0.0.0',
        port: 1337,
        log_level: 'tiny',
        prefix: 'v1',
        max_body_size: '1mb',
        public_path: 'public'
    },
    cors: {
        origin: ['http://localhost:8000', 'https://localhost:8000'],
        allowedHeaders: ['Content-Type', 'Authorization', 'locale']
    },
    database: {
        mongodb: {
            internal_db_1: {
                host: '0.0.0.0',
                port: 27017,
                name: 'internal_db_1',
            },
            only_node_demo_db_1: {
                host: '0.0.0.0',
                port: 27017,
                name: 'only_node_demo_db_1',
                node_name: 'node_demo'
            },
        },
        redis: {
            internal_db_1: {
                host: '0.0.0.0',
                port: 6379,
                name: 1,
            },
            only_node_demo_db_1: {
                host: '0.0.0.0',
                port: 6379,
                name: 0,
                node_name: 'node_demo'
            },
        },
        elasticsearch: {
            internal_db_1: {
                protocol: 'http',
                host: '0.0.0.0',
                port: 9200
            },
            only_node_demo_db_1: {
                protocol: 'http',
                host: '0.0.0.0',
                port: 9200,
                node_name: 'node_demo'
            }
        },
    },
}

export default ENV