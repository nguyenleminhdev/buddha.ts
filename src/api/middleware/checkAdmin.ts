import { Middleware } from '../../interface/api'

export default ((req, res, proceed) => {
    console.log('checkAdmin')

    proceed()
}) as Middleware