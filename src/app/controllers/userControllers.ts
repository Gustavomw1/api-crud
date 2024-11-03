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

//Cadastrar usuario
userRouter.post("/register", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  //Hasheando senha
  const HasheandoPassword = await bcrypt.hash(senha, 10);

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatorios" });
  }

  try {
    const query = "INSERT INTO users (email, senha) VALUES (?, ?)";
    const result = await db.query(query, [email, HasheandoPassword]);

    return res.status(201).json({ mensagem: "Usuario criado" });
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuario" });
  }
});

//Verificação jwt - login
userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const usuarios = result[0];

    if (!usuarios) {
      return res.status(404).json({ mensagem: "Senha incorreta" });
    }

    //Verificar a senha usando bcrypt
    const senhaCorreta = await bcrypt.compare(senha, usuarios.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    // Gera um token jwt
    const token = jwt.sign({ id: usuarios.id }, SECRET, { expiresIn: "1h" });

    return res
      .status(200)
      .json({ mensagem: "Usuario logado com sucesso", token });
  } catch (erro) {
    console.log("Erro ao logar usuario:", erro);
    return res.status(500).json({ mensagem: "Erro ao logar usuario" });
  }
});

//Deletar usuario
userRouter.delete("/profile/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.status(200).json({ mensagem: "Usuario deletado com sucesso" });
  } catch {
    res.status(401).json({ erro: "Erro ao deletar usuario" });
  }
});

export default userRouter;
