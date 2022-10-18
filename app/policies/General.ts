import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export interface payload {
    id: number;
    iat: number;
    exp: number;
}

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).json('Acces denied');

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET) as payload;    
    } catch (error) {
        console.log(error)
        return res.status(401).json("upps... algo paso con tu token");
    }

    
     
    req.session.user = await User.findByPk(payload.id)
    
    next();
        
    
}