import { Cb } from '../interface/function'
import { Env } from '../interface/env'

const NODE_ENV = process.env.NODE_ENV || 'development'

export async function loadCurrentEnvConfig(proceed: Cb) {
    const ENV: { default: Env } = await import(`../config/env/${NODE_ENV}`)

    globalThis.$env = ENV.default
    console.log(`✔ Env config loading successfully`)
    proceed()
}