export interface Lang {
    PING: string
    SUCCESS: string
    ACCESS_DENIED: string
    NOT_FOUND: {
        [index: string]: string
    }
    REQUIRE: {
        [index: string]: string
    }
    MISSING: {
        [index: string]: string
    }
    EXPIRED: {
        [index: string]: string
    }
}