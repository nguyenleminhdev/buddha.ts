import type { Middleware } from 'buddha-core'

export default ((req, res, proceed) => {
    proceed()
}) as Middleware