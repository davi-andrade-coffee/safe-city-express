import { ReturnModelType } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import OccorrenceSchema, { TypeOccurrence } from '../../../database/model/occurrence';

@injectable()
export default class OccurrenceController {
    occurrenceModel: ReturnModelType<typeof OccorrenceSchema>
    
    constructor(
        @inject(OccorrenceSchema) occurrenceModel: ReturnModelType<typeof OccorrenceSchema> 
    ) {
        this.occurrenceModel = occurrenceModel;
    }

    async typeOccurrence(req: Request, res: Response) {
        try {
            return res.status(201).json({ types: Object.values(TypeOccurrence) });
        } catch(err: any) {
            return res.status(503).json({message: err.message});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {
                description, type, date,
                cep
            } = req.body;
            
            const model = new this.occurrenceModel();
            model._id = new mongoose.Types.ObjectId();
            model.description = description;
            model.type = type;
            model.date = new Date(date);
            model.cep = cep;
            model.created_user_id = req.headers.user_id as string;

            await model.save()
            return res.status(201).json({id: model._id});
        } catch(err: any) {
            return res.status(503).json({message: err.message});
        }
    }

    async list(req: Request, res: Response) {
        try {
            const {
                cep
            } = req.params;

            const today = new Date();

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            const occurrences = await this.occurrenceModel.find({cep, date: {
                $gte: thirtyDaysAgo.toISOString(),
            }}, {type: 1}).lean()
            
            const total_occurrences = occurrences.length;
            const total_types_occurrences: { [k: string]: any } = {};
            for (let type in TypeOccurrence) {
                const occorrenceType = occurrences.filter((oc) => oc.type === TypeOccurrence[type as keyof typeof TypeOccurrence]);
                total_types_occurrences[TypeOccurrence[type as keyof typeof TypeOccurrence]] = {
                    total: occorrenceType.length,
                    percentage: (100 * occorrenceType.length) / total_occurrences 
                }
            }
              
            const formatResult = {
                total_occurrences,
                total_types_occurrences
            };
            return res.status(201).json(formatResult);
        } catch(err: any) {
            return res.status(503).json({message: err.message});
        }
    }
}