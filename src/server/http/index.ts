import express, {Express} from 'express';
import { injectable, inject } from 'inversify';
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

        for (const router of allRouters) {
            router.load(this.app);
        }
    }

    start() {
        this.app.listen(this.port, () => console.log(`SERVER HTTP LISTEN IN ${this.port}`))
    }
}