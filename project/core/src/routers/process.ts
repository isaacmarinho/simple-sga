import express from "express";

const processesRouter = express.Router();

const processesController = require("../controllers/processController");

processesRouter.get("/", processesController.process);

module.exports = processesRouter;