import { Request, Response, Router } from "express";
import { AppDataSource } from "../../database/data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "agua";
const db = AppDataSource;
const userRouter = Router();

//Ver user
userRouter.get("/profile", async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM users;");
    return res.status(200).json({ result });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro buscar perfil" });
  }
});

export default userRouter;
