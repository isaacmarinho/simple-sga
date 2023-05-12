import express from "express";
import dotenv from "dotenv";

const aboutRouter = require("./routes/about");
const processRouter = require("./routes/process");

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3001", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const app = express();

app.use(express.json());
app.use(express.static("client"));

app.use("/environmental/process", processRouter);
app.use("/environmental/about", aboutRouter);


app.listen(PORT, HOST_NAME, () => {
    console.log(`Environmental server running at ${HOST_NAME}:${PORT}`)
})