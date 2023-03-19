import { injectable, interfaces } from "inversify";
import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
import mongoose, { Connection } from "mongoose";

@modelOptions({ schemaOptions: { collection: 'users',  } })
export default class UserSchema {
    @prop()
    public _id: string;
  
    @prop({required: true, type: String})
    name!: string

    @prop({required: true, type: String})
    surname!: string

    @prop({required: true, type: String})
    cpf!: string

    @prop({required: true, type: String})
    email!: string

    @prop({required: true, unique: true, type: String})
    password!: string

    @prop({required: true, type: String})
    cep!: string

    @prop({required: true, type: String})
    country!: string
}

export function getModel(context: interfaces.Context): ReturnModelType<typeof UserSchema> {
    const connection = context.container.get<Connection>(Connection)
    return getModelForClass(UserSchema, {
        existingConnection: connection
    })
}