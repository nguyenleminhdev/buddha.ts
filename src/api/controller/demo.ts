import { Controller } from '../../interface/api'

export const index: Controller = (req, res) => {
    let p = req.allParams()

    res.ok($lang.t('COMMON.PING', req.locale))
}