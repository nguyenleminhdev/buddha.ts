import { createHash } from 'crypto'

/**tạo id unique */
export const md5_id = () => createHash('md5')
    .update(
        new Date()
            .getTime()
            .toString()
    )
    .digest('hex')