import { Cb } from '../interface/function'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Constant } from '../interface/constant'
import { green } from 'chalk'

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

            globalThis.$constant = constant as Constant

            console.log(green`✔ Constant variable loading successfully`)
            proceed()
        })
}