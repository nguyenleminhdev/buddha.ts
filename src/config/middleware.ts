export interface MiddlewareConfig {
    [index: string]: string[]
}

export default ({
    '/private/admin': ['checkAdmin'],
    '/public': ['checkToken', 'checkAdmin']
}) as MiddlewareConfig