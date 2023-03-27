import { MongodbConfig, RedisConfig, ElasticsearchConfig } from "../core/database"

enum LogLevel { combined, common, dev, tiny, none }

export interface Env {
    app: {
        /**
         * tin nhắn chào mừng khi khởi động server, hoặc khi gọi api root
         */
        hello_message: string
        /**
         * Xoá log khởi động mã nguồn
         */
        clear_log: boolean
        /**
         * server sẽ được khởi chạy trên địa chỉ ip này
         */
        host: string
        /**
         * server sẽ được khởi chạy trên cổng này
         */
        port: number
        /**
         * cài đặt các cấp bậc http log
         */
        log_level: keyof typeof LogLevel
        /**
         * cấu hình phần đầu của api
         * - vd: host:port/PREFIX/*
         */
        prefix: string
        /**
         * dung lượng tối đa mà body có thể truyền lên server
         */
        max_body_size: string
        /**
         * server sẽ phục vụ file tĩnh ở thư mục này
         */
        public_path: string
    }
    cors: {
        /**
         * cho phép các domain nào được phép gọi lên server
         */
        origin?: string[] | string | '*'
        /**
         * cho phép các header nào được phép truyền lên server
         */
        allowedHeaders?: string[]
    }
    database: {
        mongodb: {
            [index: string]: MongodbConfig
        }
        redis: {
            [index: string]: RedisConfig
        }
        elasticsearch: {
            [index: string]: ElasticsearchConfig
        }
    }
}