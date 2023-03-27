import { Cb } from '../interface/function'

export const CatchAllServerUnknownError = (proceed: Cb) => {
    process.on('unhandledRejection', (e: any) => {
        if (e.stack.includes('MongooseServerSelectionError: connect ECONNREFUSED')) return

        console.log('CATCH [unhandledRejection]::', e)
    })
    process.on('uncaughtException', function (e) {
        console.log('CATCH [uncaughtException]::', e)
    })

    proceed()
}