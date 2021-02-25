import { Request, Response } from 'express'

export const authMiddleware = (err: {name: string, message: string}, req: Request, res: Response, next: any) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401)
    }
    res.send({error: err.message})

    next();
}