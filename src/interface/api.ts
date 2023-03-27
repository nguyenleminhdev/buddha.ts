import { Request, Response, NextFunction } from 'express'

/**
 * định nghĩa một api
 */
export type Controller = (req: Request, res: Response) => void
/**
 * định nghĩa một policy
 */
export type Middleware = (
    req: Request, 
    res: Response, 
    proceed: NextFunction
) => void