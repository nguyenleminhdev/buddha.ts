interface MiddlewareConfig {
    [index: string]: string[]
}

const CONFIG: MiddlewareConfig = {
    '/': ['checkAuthorization'],
}

export default CONFIG