import {DeleteResult, Document, InsertOneResult, MongoClient, ObjectId, OptionalId, UpdateResult} from "mongodb";

import {Request, Response, Router} from "express";
import {Result} from "../../shared/interfaces/Result";
import dotenv from "dotenv";
import {Attachment} from "../../shared/interfaces/Attachment";


const processRoute = Router();


export interface Process {
    project: string;
    code: string;
    name: string;
    status: string;
    tags: string[];
    subscribers: string[];
    expiration: number;
    attachments: Attachment[];
    creation_date: Date;
    created_by: string;
    last_update: Date;
}

dotenv.config();

const DB_HOST = process.env.DATABASE_SERVER_NAME;
const DB_PORT = process.env.DATABASE_SERVER_PORT;
const DB_USER = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DEFAULT_DB = process.env.DATABASE_NAME;
const SGA_DB = process.env.SGA_DATABASE_NAME;
const DB_PARAMS = process.env.DATABASE_PARAMS;

// Connection URI
// const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?${DB_PARAMS}`;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?${DB_PARAMS}`;

// Create a new MongoClient
const client = new MongoClient(uri);

async function connect() {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db(DEFAULT_DB).command({ping: 1});
    console.log("Connected successfully to server");
}

async function getProcess(processId: String) {
    let result: any = null;
    try {

        await connect();

        const dbo = client.db(SGA_DB);
        const resultSet = dbo.collection("process").find({_id: processId});
        console.log(resultSet);
        await resultSet.explain().then((value: Document) => {
            console.log(value);
            result = value;
        }).catch((reason: any) => {
            const message = "Find failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
            console.log(message);
        });
    } catch (e) {
        console.log(e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    return result;
}

processRoute.get("/", async (req: Request, res: Response) => {
    try {

        await connect();

        const dbo = client.db(SGA_DB);

        console.log("URL: {}",req.url);
        console.log("ORIG. URL: {}", req.originalUrl);
        const {query} = req;
        console.log(req.query);
        console.log(query);
        let pageNumber: number = parseInt(String(query.pageNumber)|| "0",10);
        console.log(pageNumber);
        // if (pageNumber > 0) {
        //     pageNumber -= 1;
        // }

        const limit = parseInt(String(query.limit) || "5", 10);
        console.log(limit);
        const result: Result = {
            count: 0,
            rowsPerPage: limit,
            data: null,
            pageNumber: pageNumber,
            next: null,
            previous: null
        };

        const totalProcesses = await dbo.collection("process").countDocuments();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.count = totalProcesses;

        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }

        if (endIndex <= (await dbo.collection("process").countDocuments())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }

        result.data = await dbo.collection("process").find({})
            .sort("-_id")
            .skip(startIndex)
            .limit(limit).toArray();
        result.rowsPerPage = limit;

        if (result.count > 0) {
            return res.json({msg: "Process.ts Fetched successfully", data: result});
        } else {
            return res.json({msg: "No process to fetch", data: result});
        }
    } catch (e) {
        console.log(e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})

processRoute.post("/add", async (req: Request, res: Response) => {
    let result: any = null;
    try {
        if (!!req.body) {
            await connect();
            const dbo = client.db(SGA_DB);
            const process: OptionalId<Process> = req.body;
            console.log(process);
            await dbo.collection("process").insertOne(process).then((value: InsertOneResult) => {
                const message = value.acknowledged ? "Successfully added!" : "Nothing added!";
                result = res.json({msg: message, data: value});
            }).catch((reason: any) => {
                console.log(reason);
                const message = "Create failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({msg: message, data: reason});
            });
        } else {
            result = res.json({msg: "No process to add!", data: req.body});
        }
    } catch (e) {
        console.log(e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    return result;
})

processRoute.delete("/remove/:processId", async (req: Request, res: Response) => {
    let result: any = null;
    try {
        if (!!req.params.processId) {
            await connect();
            const dbo = client.db(SGA_DB);
            console.log(process);
            const processId: ObjectId = new ObjectId(req.params.processId);
            await dbo.collection("process").deleteOne({_id: processId}).then((value: DeleteResult) => {
                console.log(value);
                const message = value.acknowledged ? "Successfully removed!" : "Nothing removed!";
                result = res.json({msg: message, data: value});
            }).catch((reason: any) => {
                console.log(reason);
                const message = "Remove failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({msg: message, data: reason});
            });
        } else {
            result = res.json({msg: "Process.ts doesn't exist!", data: req.params.processId});
        }
    } catch (e) {
        console.log(e);
        result = res.json({msg: "An error occurred", data: e});
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    return result;
})

processRoute.patch("/update/:processId", async (req: Request, res: Response) => {
    let result: any = null;
    try {
        if (!!req.params.processId && !!req.body) {
            await connect();
            const dbo = client.db(SGA_DB);
            const processId: ObjectId = new ObjectId(req.params.processId);
            const process: Partial<Process> = req.body;
            await dbo.collection("process").updateOne({_id: processId}, {$set: process}).then((value: UpdateResult) => {
                console.log(value);
                const message = value.acknowledged ? "Successfully updated!" : "Nothing changed!";
                result = res.json({msg: message, data: value});

            }).catch((reason: any) => {
                console.log(reason);
                const message = "Update failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({msg: message, data: reason});
            });
        } else {
            result = res.json({msg: "Process.ts doesn't exist!", data: req.params.processId});
        }
    } catch (e) {
        console.log(e);
        result = res.json({msg: "An error occurred", data: e});
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    return result;
})

module.exports = processRoute