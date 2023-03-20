import { ReturnModelType } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import UserSchema from '../../../database/model/user';

@injectable()
export default class UserController {
    userModel: ReturnModelType<typeof UserSchema>
    
    constructor(
        @inject(UserSchema) userModel: ReturnModelType<typeof UserSchema> 
    ) {
        this.userModel = userModel;
    }

    async create(req: Request, res: Response) {
        try {
            const {
                name, surname, cpf,
                email, password, cep,
                country
            } = req.body;
            
            const isExistEmail = await this.userModel.findOne({email: email}).lean()
            if (isExistEmail) return res.status(403).json({message: 'Esse email já está sendo utilizado'})

            const model = new this.userModel();
            model._id = new mongoose.Types.ObjectId()
            model.name = name;
            model.surname = surname;
            model.cpf = cpf;
            model.email = email;
            model.password = password;
            model.cep = cep;
            model.country = country;

            await model.save()
            return res.status(201).json({id: model._id});
        } catch(err: any) {
            return res.status(503).json({message: err.message});
        }
    }

    async login(req: Request, res: Response) {
        try {
            const {
                email, password
            } = req.body;
            
            const user = await this.userModel.findOne({email: email}).lean()
            if (!user) return res.status(403).json({message: 'Esse email não está cadastrado'})

            if (user.password !== password) return res.status(403).json({message: 'Essa senha é inválida'})

            const token = jwt.sign({_id: user._id}, process.env.KEY_TOKEN || '')

            return res.status(201).json({ ...user, token });
        } catch(err: any) {
            return res.status(503).json({message: err.message});
        }
    }
}