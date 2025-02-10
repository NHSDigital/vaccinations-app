import { Request, Response } from "express";

const IndexController = (req: Request, res: Response) => {
  res.render("index", { title: "Vaccinations" });
};

export default IndexController;
