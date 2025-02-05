import { Router } from "express";
import IndexController from "controllers/index";

const IndexRouter = Router();

/* GET home page. */
IndexRouter.get("/", IndexController);

export default IndexRouter;
