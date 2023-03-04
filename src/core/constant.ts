import { Cb } from '../interface/function'
import { readdirSync } from 'fs'
import { join } from 'path'

export async function loadConstant(proceed: Cb) {
    const PATH = `${__dirname}/../config/constant`

    Promise
        .all(
            readdirSync(PATH)
                .map(r => import(join(PATH, r)))
        )
        .then(r => {
            let constant = {}

            r.map(n => { constant = { ...constant, ...n } })

            globalThis.$constant = constant

            console.log(`✔ Constant variable loading successfully`)
            proceed()
        })
}