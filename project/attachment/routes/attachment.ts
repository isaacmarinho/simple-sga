import {Request, Response, Router} from "express";
import dotenv from "dotenv";
import fs from "fs";

const WebHdfs = require("webhdfs");

dotenv.config();

const HADOOP_USER = process.env.HADOOP_USER;
const HADOOP_HOST = process.env.HADOOP_HOST;
const HADOOP_PORT = process.env.HADOOP_PORT || "9870";
const HDFS_PATH = process.env.HDFS_PATH;

const hdfs = WebHdfs.createClient({
    user: HADOOP_USER,
    host: HADOOP_HOST,
    port: parseInt(HADOOP_PORT, 10),
    path: HDFS_PATH
});

const attachmentRoute = Router();

attachmentRoute.post("/add", async (req: Request, res: Response) => {
    const localFileStream = fs.createReadStream("./README.md");
    const remoteFileStream = hdfs.createWriteStream("README.md");
    localFileStream.pipe(remoteFileStream);

    let error: any = null;
    remoteFileStream.on("error", (err: any) => {
        error = err;
        console.log(err);
    });

    remoteFileStream.on("finish", (value: any) => {
        if (!error) {
            res.send({msg: "File saved!", data: value});
        } else {
            res.send({msg: "Failed to save file."})
        }
    })
})

attachmentRoute.post("/get/:filename", async (req: Request, res: Response) => {
    const filename: String = req.params.filename;
    const remoteFileStream = hdfs.createReadStream("README.md");

    remoteFileStream.on("error", (err: any) => {
        console.log(err);
    });

    remoteFileStream.on("data", (chunk: any) => {
        res.send({msg: "Loading file", data: chunk})
    });

    remoteFileStream.on("finish", (value: any) => {
        res.send({msg: "File loaded!", data: value})
    });
})

module.exports = attachmentRoute