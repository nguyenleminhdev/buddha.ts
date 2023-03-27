import { Cb } from '../interface/function'
import { red } from 'chalk'

export const loadSocket = (proceed: Cb) => {
    console.log(red`❌ Socket is incomming feature`)
    console.log(red`\t⇨ socket.io`)
    console.log(red`\t⇨ websocket`)

    proceed()
}