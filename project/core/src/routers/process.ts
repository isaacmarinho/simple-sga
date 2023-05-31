import express from "express";

const processesRouter = express.Router();

const processesController = require("../controllers/processController");

processesRouter.get("/", processesController.process);
processesRouter.get("/summary/:process_type", processesController.summary);

module.exports = processesRouter;