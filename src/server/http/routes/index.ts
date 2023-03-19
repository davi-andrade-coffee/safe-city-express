import { Express } from "express";
import { injectable } from "inversify";

@injectable()
export default abstract class _Router {

    abstract load(app: Express): void
}