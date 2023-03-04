import { Cb } from '../interface/function'

export const loadSocket = (proceed: Cb) => {
    console.log(`❌ Socket is incomming feature`)
    console.log(`\t⇨ socket.io`)
    console.log(`\t⇨ websocket`)

    proceed()
}