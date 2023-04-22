import express from "express";
// import bodyParser from "body-parser";
import dotenv from "dotenv";

const aboutRouter = require("./routes/about");
const userRouter = require("./routes/user");

dotenv.config();

const PORT = parseInt(process.env.SERVER_PORT || "3000", 10);
const HOST_NAME = process.env.SERVER_NAME || "localhost";
const app = express();
app.use(express.json());
app.use(express.static("client"));
// app.use(bodyParser.urlencoded({extended: true}));

app.use("/user", userRouter);
app.use("/about", aboutRouter);


app.listen(PORT, HOST_NAME, () => {
    console.log(`Admin server running at ${HOST_NAME}:${PORT}`)
})