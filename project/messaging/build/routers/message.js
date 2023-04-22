"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageRouter = express_1.default.Router();
const messageController = require("../controllers/messageController");
messageRouter.post("/", messageController.send);
