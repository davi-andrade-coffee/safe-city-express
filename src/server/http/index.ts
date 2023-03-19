import express, {Express} from 'express';

export default class ServerHttp {
    app: Express
    port: number = 9001

    constructor() {
        this.app = express()

    }

    start() {
        this.app.listen(() => `SERVER HTTP LISTEN IN ${this.port}`)
    }
}