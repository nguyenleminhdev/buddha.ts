import { readdirSync } from 'fs'
import { join } from 'path'
import { Cb } from '../interface/function'
import { Lang as Language } from '../interface/language'
import { get, keys } from 'lodash'
import { green, blue } from 'chalk'

interface Source {
    [index: string]: Language
}
interface T {
    (alias: string, language?: string): string
}

export interface Lang {
    source: Source
    t: T
}

const t: T = (alias: string, language = 'vn') => {
    const SOURCE = get($lang.source, language, {})

    return get(SOURCE, alias, alias)
}

export async function loadLanguage(proceed: Cb) {
    const PATH = `${__dirname}/../lang`

    Promise
        .all(
            readdirSync(PATH)
                .map(async r => {
                    return {
                        name: r.replace('.ts', '').replace('.js', ''),
                        data: await import(join(PATH, r))
                    }
                })
        )
        .then(r => {
            let source: Source = {}
            
            r.map(n => { 
                const TEMP: Source = {}

                TEMP[n.name] = n.data.default

                source = { ...source, ...TEMP } 
            })

            globalThis.$lang = { source, t }

            console.log(green`✔ Language i18n loading successfully`)

            keys(source).map(n => console.log(blue`\t⇨ ${n}`))

            proceed()
        })
}