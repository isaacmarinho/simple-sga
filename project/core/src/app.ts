import express from "express";
import bodyParser from "body-parser";
import * as swaggerUI from "swagger-ui-express";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const aboutRouter = require("./routers/about");
const processesRouter = require("./routers/process");
const swaggerFile = require('../swagger_output.json')

const basePath = "/core";
app.use(`${basePath}/about`, aboutRouter);
app.use(`${basePath}/process`, processesRouter);
app.use(`${basePath}/doc`, swaggerUI.serve, swaggerUI.setup(swaggerFile));

module.exports = app;
