import type { MiddlewareConfig } from 'buddha-core'

const CONFIG: MiddlewareConfig = {
    '/app': ['checkApp'],
}

export default CONFIG