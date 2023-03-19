import _Router from ".";
import { Express, Router } from "express";
import { injectable, inject, named } from "inversify";
import { Middleware } from '../middleware/index'
import OccurrenceController from "../controller/occurrence";

@injectable()
export default class OccurrenceRouter extends _Router {
    controller: OccurrenceController;
    middlewareToken: Middleware;

    constructor(
        @inject(OccurrenceController) userController: OccurrenceController,
        @inject('middleware') @named('midd-token') middlewareToken: Middleware
    ) {
        super();
        this.middlewareToken = middlewareToken;
        this.controller = userController;
    }

    load(app: Express) {
        const router = Router();

        router.post('/create', this.middlewareToken, this.controller.create.bind(this.controller))
        router.post('/types', this.middlewareToken, this.controller.typeOccurrence.bind(this.controller))
        router.post('/list', this.middlewareToken, this.controller.list.bind(this.controller))

        app.use('/occurrence', router);
    }
}   