import { Request, Response } from "express";

const IndexController = (req: Request, res: Response) => {
  res.render("index", { title: "Express" });
};

export default IndexController;
