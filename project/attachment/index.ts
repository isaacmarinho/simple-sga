import express from "express";
import dotenv from "dotenv";

const aboutRouter = require("./routes/about");
const attachmentRouter = require("./routes/attachment");

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3002", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const app = express();
app.use(express.json());
app.use(express.static("client"));

app.use("/attachment", attachmentRouter);
app.use("/about", aboutRouter);


app.listen(PORT, HOST_NAME, () => {
    console.log(`Attachment server running at ${HOST_NAME}:${PORT}`)
})