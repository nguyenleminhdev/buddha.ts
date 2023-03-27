import { Middleware } from '../../interface/api'

export default ((req, res, proceed) => {
    console.log('run middleware')

    proceed()
}) as Middleware