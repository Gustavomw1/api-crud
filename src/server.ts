import express from "express";
import cors from "cors";
import routers from "./app/routes/routes";
import path from "path";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta "public"
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// Rotas
app.use(routers);

// Inicia o servidor
app.listen(3000, () => {
  console.log("Server ok");
});
