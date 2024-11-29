import { Request, Response, Router } from "express";
import { AppDataSource } from "../../database/data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error(
    "SECRET não definida. Certifique-se de configurar no arquivo .env."
  );
}

const db = AppDataSource;
const userRouter = Router();

// Ver usuários
userRouter.get("/profile", async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM users;");
    return res.status(200).json({ result });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao buscar perfil" });
  }
});

// Cadastrar usuário
userRouter.post("/register", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const query = "INSERT INTO users (email, senha) VALUES (?, ?)";
    await db.query(query, [email, hashedPassword]);

    return res.status(201).json({ mensagem: "Usuário criado" });
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
});

// Login e verificação JWT
userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const usuario = result[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    // Gera token JWT
    const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: "1h" });

    return res
      .status(200)
      .json({ mensagem: "Usuário logado com sucesso", token });
  } catch (erro) {
    console.error("Erro ao logar usuário:", erro);
    return res.status(500).json({ mensagem: "Erro ao logar usuário" });
  }
});

// Deletar usuário
userRouter.delete("/profile/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (erro) {
    console.error("Erro ao deletar usuário:", erro);
    return res.status(500).json({ mensagem: "Erro ao deletar usuário" });
  }
});

export default userRouter;
