import { readFile } from 'fs'
import { Cb } from '../interface/function'
const { name, version } = require('../../package.json')

export const loadBuddha = (proceed: Cb) => readFile(
    `${process.cwd()}/buddha.txt`,
    'utf-8',
    (e, r) => {
        if (e) return proceed(e)

        if ($env.app.clear_log) console.clear()

        console.log(r)

        console.log(
            `✨${name}✨`,
            ` v${version}`,
            `${process.env.NODE_ENV || 'development'}`
        )

        console.table($logging)

        console.log($env.app.hello_message, '✅')

        proceed()
    }
)