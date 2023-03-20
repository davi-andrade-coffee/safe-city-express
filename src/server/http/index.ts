import express, { Express } from 'express';
import { injectable, inject } from 'inversify';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ServiceIdentifier } from '../../interfaces/enum';
import _Router from './routes';


@injectable()
export default class ServerHttp {
    private app: Express;
    private port: number = +(process.env.PORT_HTTP || '')

    constructor(
        @inject(ServiceIdentifier.ROUTERS) allRouters: _Router[]
    ) {
        this.app = express()

        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        this.app.use(cors())

        this.app.use((_req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');

            next();
        });

        for (const router of allRouters) {
            router.load(this.app);
        }
    }

    start() {
        this.app.listen(this.port, () => console.log(`SERVER HTTP LISTEN IN ${this.port}`))
    }
}