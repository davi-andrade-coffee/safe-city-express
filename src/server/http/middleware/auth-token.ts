import { ReturnModelType } from "@typegoose/typegoose";
import { Request, Response, NextFunction } from "express";
import { interfaces } from "inversify";
import jwt from 'jsonwebtoken';
import { Middleware } from ".";
import UserSchema from "../../../database/model/user";


export default (context: interfaces.Context): Middleware => {
    const userModel = context.container.get(UserSchema) as unknown as ReturnModelType<typeof UserSchema> ;

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.headers.authorization;
            if (!token) return res.status(403).json({message: "Não foi encontrado o token"})

            token = token.replace('Bearer ', '')
            const decoded = jwt.verify(token, process.env.KEY_TOKEN || '') as UserSchema;

            const userId = decoded._id;
            if (!userId) return res.status(403).json({message: "Token inválido"})

            const user = await userModel.findById(userId).lean()
            if (!user) return res.status(403).json({message: "Token inválido"})

            req.headers.user_id = userId;

            next()
        } catch (err: any) {
            return res.status(503).json({ message: err.message });
        }
    }
}