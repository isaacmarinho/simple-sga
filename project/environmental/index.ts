import express from "express";
import dotenv from "dotenv";
import * as swaggerUI from "swagger-ui-express";

const bodyParser = require('body-parser');
const aboutRouter = require("./routes/about");
const processRouter = require("./routes/process");
const swaggerFile = require('./swagger_output.json');

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3001", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("client"));

const basePath = "/environmental";
app.use(`${basePath}/process`, processRouter);
app.use(`${basePath}/about`, aboutRouter);
app.use(`${basePath}/doc`, swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.listen(PORT, HOST_NAME, () => {
    console.log(`Environmental server running at ${HOST_NAME}:${PORT}`)
})