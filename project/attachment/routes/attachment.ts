import {Request, Response, Router} from "express";
import dotenv from "dotenv";
import fs from "fs";
import * as console from "console";
import {rimraf} from "rimraf";
import {randomUUID} from "crypto";

const getDirName = require('path').dirname;
const WebHdfs = require("webhdfs");
const uploadFile = require("../middleware/upload");
const fileUtils = require("../utils/file-utils");

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
    /// #swagger.description = 'Salva anexo de processo no sistema de arquivos distribuído'
    /*  #swagger.path = '/file/add'
        #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                        schema: { $ref: "#/definitions/AttachmentForm" }
                      }
                  }
              }
     */
    try {
        await uploadFile(req, res);
    } catch (err: any) {    // error handling
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File larger than 2MB cannot be uploaded!",
            });
        }
        res.status(500).send({
            message: `Unable to upload the file: ${req.file?.originalname}. ${err}`,
        });
    }

    const filename = req.file?.originalname;
    const tempFile = `./temp/uploads/${req.file?.originalname}`;
    const localFileStream = fs.createReadStream(tempFile);
    const remoteFileStream = hdfs.createWriteStream(`/environmental/${filename}`);
    localFileStream.pipe(remoteFileStream);

    let error: any = null;
    remoteFileStream.on("error", (err: any) => {
        console.log("Error");
        error = err;
        console.log(err);
    });

    remoteFileStream.on("finish", (value: any) => {
        fs.stat(tempFile, (err, stats) => {
            if (!err) {
                rimraf.native(tempFile);
            }
        });
        console.log("Finish");
        if (!error) {
            res.send({msg: "File saved!", data: value});
        } else {
            res.send({msg: "Failed to save file."})
        }
    });
})

attachmentRoute.get("/get/:filename", async (req: Request, res: Response) => {
    /// #swagger.description = 'Obtém um anexo salvo no sistema de arquivos distribuído.'
    /*  #swagger.path = '/file/get/{filename}'
        #swagger.parameters['filename'] = {
            in: 'path',
            type: 'string',
            description: 'Nome do anexo.' }
          */
    const filename: String = req.params.filename;
    const remoteFileStream = hdfs.createReadStream(`/environmental/${filename}`);
    const tempFile = `./temp/${randomUUID()}/${filename}`;

    let hasErrors: boolean = false;
    let errorMessage: any;
    remoteFileStream.on("error", (err: any) => {
        hasErrors = true;
        errorMessage = {msg: "Failed to load file!", data: err};
    });

    let buff: Buffer;
    remoteFileStream.on("data", (chunk: any) => {
        buff = chunk;
    });

    remoteFileStream.on("finish", (value: any) => {
        console.log("File loaded!", buff);
        fs.mkdir(getDirName(tempFile), {recursive: true}, function (err) {
            if (err) {
                hasErrors = true;
                console.log(err);
                errorMessage = {msg: "Failed to load file!", data: err};
                return;
            }
            console.log(buff);
            fs.writeFile(tempFile, buff, {encoding: "hex"}, (err) => {
                if (err) {
                    hasErrors = true;
                    console.log(err);
                    errorMessage = {msg: "Failed to load file!", data: err};
                } else {
                    res.download(tempFile, () => {
                        console.log(getDirName(tempFile));
                        rimraf.native(getDirName(tempFile));
                    });
                }
                return;
            });
        });

        if (hasErrors) {
            res.send(errorMessage);
        }
    });
})

module.exports = attachmentRoute