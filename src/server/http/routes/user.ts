import _Router from ".";
import { Express, Router } from "express";
import { injectable, inject } from "inversify";
import UserController from "../controller/user";

@injectable()
export default class UserRouter extends _Router {
    controller: UserController;

    constructor(
        @inject(UserController) userController: UserController
    ) {
        super();
        this.controller = userController;
    }

    load(app: Express) {
        const router = Router();

        router.post('/create', this.controller.create.bind(this.controller))
        router.post('/login', this.controller.login.bind(this.controller))

        app.use('/user', router);
    }
}   