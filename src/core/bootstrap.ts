import { readdirSync } from 'fs'
import { join } from 'path'
import { Cb } from '../interface/function'

export const loadBootstrap = (proceed: Cb) => {
    const PATH = `${__dirname}/../helper/bootstrap`

    Promise
        .all(readdirSync(PATH)
            .map(async r => {
                await import(join(PATH, r))

                return r
            }))
        .then(r => {
            console.log(`✔ Bootstrap loading successfully`)

            console.log(`\t⇨ ${r}`)

            proceed()
        })
}