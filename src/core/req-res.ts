import { readdirSync } from 'fs'
import { join } from 'path'
import express from 'express'
import { Cb } from '../interface/function'

enum ReqRes { request, response }
type FunctionCustom = (
    type: keyof typeof ReqRes,
    path: string,
) => void

const customRequestResponse = ((type, path) => {
    readdirSync(path)
        .forEach(async r => {
            const module = await import(join(path, r))

            express[type][module.default.name] = module.default

            console.log(`\t⇨ ${type}: ${module.default.name}()`)
        })
}) as FunctionCustom

export const loadCustomRequestResponse = (proceed: Cb) => {
    console.log(`✔ Custom request, response loading successfully`)

    customRequestResponse(
        'request',
        `${__dirname}/../helper/request`
    )
    customRequestResponse(
        'response',
        `${__dirname}/../helper/response`
    )

    proceed()
}