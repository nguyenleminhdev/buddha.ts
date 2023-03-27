import { readdirSync } from 'fs'
import { join } from 'path'
import { Cb } from '../interface/function'
import { isArray } from 'lodash'
import { green, blue } from 'chalk'

export interface Bootstrap {
    service: (name: string | string[], proceed: Function) => void
}

export const loadBootstrap = (proceed: Cb) => {
    globalThis.$bootstrap = {
        service: (name, proceed) => {
            if (!process.env.NODE_NAME) return proceed()
            if (process.env.NODE_NAME === name) return proceed()
            if (isArray(name) && name.includes(process.env.NODE_NAME)) return proceed()

            return
        }
    }

    const PATH = `${__dirname}/../helper/bootstrap`

    Promise
        .all(readdirSync(PATH)
            .map(async r => {
                await import(join(PATH, r))

                return r
            }))
        .then(r => {
            console.log(green`✔ Bootstrap loading successfully`)

            console.log(blue`\t⇨ ${r}`)

            proceed()
        })
        .catch(e => proceed())
}