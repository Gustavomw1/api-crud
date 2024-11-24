"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve arquivos estáticos da pasta "public"
const publicPath = path_1.default.resolve(__dirname, "public");
app.use(express_1.default.static(publicPath));
// Rotas
app.use(routes_1.default);
// Inicia o servidor
app.listen(3000, () => {
    console.log("Server ok");
});
