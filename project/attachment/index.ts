import express from "express";
import dotenv from "dotenv";
import * as swaggerUI from "swagger-ui-express";

const aboutRouter = require("./routes/about");
const attachmentRouter = require("./routes/attachment");
const swaggerFile = require('./swagger_output.json')

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3002", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const app = express();
app.use(express.json());
app.use(express.static("client"));

const basePath = "/attachment";
app.use(`${basePath}/file`, attachmentRouter);
app.use(`${basePath}/about`, aboutRouter);
app.use(`${basePath}/doc`, swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.listen(PORT, HOST_NAME, () => {
    console.log(`Attachment server running at ${HOST_NAME}:${PORT}`)
})