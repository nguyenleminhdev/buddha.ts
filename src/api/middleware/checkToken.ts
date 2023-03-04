import { Middleware } from '../../interface/api'

export default ((req, res, proceed) => {
    console.log('check token')

    proceed()
}) as Middleware