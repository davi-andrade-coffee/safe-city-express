import { injectable, interfaces } from "inversify";
import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
import mongoose, { Connection } from "mongoose";

export enum TypeOccurrence {
    ASSALTO = 'assalto',
    FURTO = 'furto',
    ROUBO = 'roubo',
    ASSEDIO = 'assedio',
    OUTROS = 'outros'
}

@modelOptions({ schemaOptions: { collection: 'occorrence' } })
export default class OccorrenceSchema {
    @prop()
    public _id: string;
  
    @prop({required: false, type: String})
    description: string

    @prop({required: true, enum: TypeOccurrence})
    type!: TypeOccurrence

    @prop({required: true, type: Date})
    date!: Date

    @prop({required: true, type: String})
    created_user_id!: string

    @prop({required: true, type: String})
    cep!: string
}

export function getModel(context: interfaces.Context): ReturnModelType<typeof OccorrenceSchema> {
    const connection = context.container.get<Connection>(Connection)
    return getModelForClass(OccorrenceSchema, {
        existingConnection: connection
    })
}