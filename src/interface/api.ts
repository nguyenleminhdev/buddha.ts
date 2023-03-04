/*******************************************************************************
 * 
 * Interface for api/
 * 
 ******************************************************************************/

import { Request, Response, NextFunction } from 'express'

// Api controller
export type Controller = (req: Request, res: Response) => void

// Api middleware
export type Middleware = (
    req: Request, 
    res: Response, 
    proceed: NextFunction
) => void