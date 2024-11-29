"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../../database/data-source");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.SECRET;
if (!SECRET) {
    throw new Error("SECRET não definida. Certifique-se de configurar no arquivo .env.");
}
const db = data_source_1.AppDataSource;
const userRouter = (0, express_1.Router)();
// Ver usuários
userRouter.get("/profile", async (_req, res) => {
    try {
        const result = await db.query("SELECT * FROM users;");
        return res.status(200).json({ result });
    }
    catch (erro) {
        return res.status(500).json({ mensagem: "Erro ao buscar perfil" });
    }
});
// Cadastrar usuário
userRouter.post("/register", async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
    }
    try {
        // Hash da senha
        const hashedPassword = await bcrypt_1.default.hash(senha, 10);
        const query = "INSERT INTO users (email, senha) VALUES (?, ?)";
        await db.query(query, [email, hashedPassword]);
        return res.status(201).json({ mensagem: "Usuário criado" });
    }
    catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);
        return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }
});
// Login e verificação JWT
userRouter.post("/login", async (req, res) => {
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
        const senhaCorreta = await bcrypt_1.default.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Senha incorreta" });
        }
        // Gera token JWT
        const token = jsonwebtoken_1.default.sign({ id: usuario.id }, SECRET, { expiresIn: "1h" });
        return res
            .status(200)
            .json({ mensagem: "Usuário logado com sucesso", token });
    }
    catch (erro) {
        console.error("Erro ao logar usuário:", erro);
        return res.status(500).json({ mensagem: "Erro ao logar usuário" });
    }
});
// Deletar usuário
userRouter.delete("/profile/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
    }
    catch (erro) {
        console.error("Erro ao deletar usuário:", erro);
        return res.status(500).json({ mensagem: "Erro ao deletar usuário" });
    }
});
exports.default = userRouter;
