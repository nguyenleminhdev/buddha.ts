import { readFile } from 'fs'
import { Cb } from '../interface/function'
const { name, version } = require('../../package.json')
import { yellow, blue, green } from 'chalk'

export const loadBuddha = (proceed: Cb) => readFile(
    `${process.cwd()}/buddha.txt`,
    'utf-8',
    (e, buddha) => {
        if (e) return proceed(e)

        if ($env.app.clear_log) console.clear()

        console.log(yellow(buddha))

        console.log(
            yellow`✨${name}✨`,
            blue` v${version}`,
            green`${process.env.NODE_NAME || ''}`,
            `${process.env.NODE_ENV || 'development'}`
        )

        console.table($logging)

        console.log(blue($env.app.hello_message), '✅')

        proceed()
    }
)