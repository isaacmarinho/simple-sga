"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const aboutRouter = require("./routes/about");
const processRouter = require("./routes/process");
dotenv_1.default.config();
const PORT = parseInt(process.env.SERVER_PORT || "3001", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("client"));
app.use("/process", processRouter);
app.use("/about", aboutRouter);
app.listen(PORT, HOST_NAME, () => {
    console.log(`Environmental server running at ${HOST_NAME}:${PORT}`);
});
