"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../../database/data-source");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = "agua";
const db = data_source_1.AppDataSource;
const userRouter = (0, express_1.Router)();
// Ver usuarios
userRouter.get("/", async (_req, res) => {
    res.send("hello word");
});
userRouter.get("/profile", async (_req, res) => {
    try {
        const result = await db.query("SELECT * FROM users;");
        return res.status(200).json({ result });
    }
    catch (erro) {
        return res.status(500).json({ mensagem: "Erro buscar perfil" });
    }
});
// Cadastrar usuario
userRouter.post("/register", async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
    }
    try {
        // Hasheando a senha
        const hashedPassword = await bcrypt_1.default.hash(senha, 10);
        const query = "INSERT INTO users (email, senha) VALUES (?, ?)";
        await db.query(query, [email, hashedPassword]);
        return res.status(201).json({ mensagem: "Usuário criado" });
    }
    catch (erro) {
        console.log("Erro ao cadastrar usuário:", erro);
        return res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }
});
// Verificação jwt - login
userRouter.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
    }
    try {
        const result = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        // Verificando se algum usuário foi encontrado
        if (result.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
        const usuarios = result[0];
        // Verificar a senha usando bcrypt
        const senhaCorreta = await bcrypt_1.default.compare(senha, usuarios.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Senha incorreta" });
        }
        // Gera um token jwt
        const token = jsonwebtoken_1.default.sign({ id: usuarios.id }, SECRET, { expiresIn: "1h" });
        return res
            .status(200)
            .json({ mensagem: "Usuário logado com sucesso", token });
    }
    catch (erro) {
        console.log("Erro ao logar usuario:", erro);
        return res.status(500).json({ mensagem: "Erro ao logar usuario" });
    }
});
// Deletar usuario
userRouter.delete("/profile/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        res.status(200).json({ mensagem: "Usuario deletado com sucesso" });
    }
    catch {
        res.status(401).json({ erro: "Erro ao deletar usuario" });
    }
});
exports.default = userRouter;
