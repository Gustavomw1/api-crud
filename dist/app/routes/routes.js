"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = __importDefault(require("../controllers/userControllers"));
const routers = (0, express_1.Router)();
routers.get("/profile", userControllers_1.default);
routers.post("/register", userControllers_1.default);
routers.post("/login", userControllers_1.default);
routers.delete("/profile/:id", userControllers_1.default);
exports.default = routers;
