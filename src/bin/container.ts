import { Container } from "inversify";

import ServerHttp from "../server/http";

export default async function newContainer() {
    const container = new Container();

    container.bind(ServerHttp).to(ServerHttp).inSingletonScope();


    return container;
}