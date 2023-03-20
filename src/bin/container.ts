import { Container } from "inversify";
import { ServiceIdentifier } from "../interfaces/enum";

import ServerHttp from "../server/http";
import UserController from "../server/http/controller/user";
import OccurrenceController from '../server/http/controller/occurrence';
import OccurrenceRouter from '../server/http/routes/occurrence';
import UserRouter from "../server/http/routes/user";
import MiddlewareToken from '../server/http/middleware/auth-token';

import newConnection from "../database";
import UserSchema, {getModel} from '../database/model/user';
import OccorrenceSchema, {getModel as getModelOccorrence} from '../database/model/occurrence';

import { Connection } from "mongoose";
import { ReturnModelType } from "@typegoose/typegoose";

export default async function newContainer() {
    const container = new Container();

    const connection = await newConnection(
        process.env.USERNAME_MONGODB || '',
        process.env.PASSWORD_MONGODB || '',
        process.env.HOST_MONGODB || '',
        process.env.DATABASE_MONGODB || ''
        ) 
    container.bind<Connection>(Connection).toConstantValue(connection);

    container.bind<ReturnModelType<typeof UserSchema>>(UserSchema as any).toDynamicValue(getModel)
    container.bind<ReturnModelType<typeof OccorrenceSchema>>(OccorrenceSchema as any).toDynamicValue(getModelOccorrence)

    container.bind('middleware').toDynamicValue(MiddlewareToken).whenTargetNamed('midd-token');

    container.bind(UserController).to(UserController).inRequestScope();
    container.bind(OccurrenceController).to(OccurrenceController).inRequestScope();

    container.bind(UserRouter).to(UserRouter).inRequestScope();
    container.bind(OccurrenceRouter).to(OccurrenceRouter).inRequestScope();

    container.bind(ServerHttp).to(ServerHttp).inSingletonScope();

    getRouters(container);

    return container;
}


function getRouters(container: Container) {
    const allRouters = [];

    allRouters.push(container.get(UserRouter));
    allRouters.push(container.get(OccurrenceRouter));

    container.bind(ServiceIdentifier.ROUTERS).toConstantValue(allRouters);
}
