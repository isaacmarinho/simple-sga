"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const processRoute = (0, express_1.Router)();
dotenv_1.default.config();
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
const client = new mongodb_1.MongoClient(uri);
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect the client to the server (optional starting in v4.7)
        yield client.connect();
        // Establish and verify connection
        yield client.db(DEFAULT_DB).command({ ping: 1 });
        console.log("Connected successfully to server");
    });
}
function getProcess(processId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = null;
        try {
            yield connect();
            const dbo = client.db(SGA_DB);
            const resultSet = dbo.collection("process").find({ _id: processId });
            console.log(resultSet);
            yield resultSet.explain().then((value) => {
                console.log(value);
                result = value;
            }).catch((reason) => {
                const message = "Find failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                console.log(message);
            });
        }
        catch (e) {
            console.log(e);
        }
        finally {
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
        return result;
    });
}
processRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connect();
        const dbo = client.db(SGA_DB);
        const { query } = req;
        let pageNumber = parseInt(String(query.pageNumber)) || 0;
        if (pageNumber > 0) {
            pageNumber -= 1;
        }
        const limit = parseInt(String(query.limit)) || 12;
        const result = { count: 0, rowsPerPage: 0, data: null, next: null, previous: null };
        const totalProcesses = yield dbo.collection("process").countDocuments();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.count = totalProcesses;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber > 1 ? pageNumber - 1 : pageNumber,
                limit: limit,
            };
        }
        if (endIndex <= (yield dbo.collection("process").countDocuments())) {
            result.next = {
                pageNumber: pageNumber + 2,
                limit: limit,
            };
        }
        result.data = yield dbo.collection("process").find({})
            .sort("-_id")
            .skip(startIndex)
            .limit(limit).toArray();
        result.rowsPerPage = limit;
        if (result.count > 0) {
            return res.json({ msg: "Process Fetched successfully", data: result });
        }
        else {
            return res.json({ msg: "No process to fetch", data: result });
        }
    }
    catch (e) {
        console.log(e);
    }
    finally {
        // Ensures that the client will close when you finish/error
        yield client.close();
    }
}));
processRoute.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    try {
        if (!!req.body) {
            yield connect();
            const dbo = client.db(SGA_DB);
            const process = req.body;
            console.log(process);
            yield dbo.collection("process").insertOne(process).then((value) => {
                const message = value.acknowledged ? "Successfully added!" : "Nothing added!";
                result = res.json({ msg: message, data: value });
            }).catch((reason) => {
                console.log(reason);
                const message = "Create failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({ msg: message, data: reason });
            });
        }
        else {
            result = res.json({ msg: "No process to add!", data: req.body });
        }
    }
    catch (e) {
        console.log(e);
    }
    finally {
        // Ensures that the client will close when you finish/error
        yield client.close();
    }
    return result;
}));
processRoute.delete("/remove/:processId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    try {
        if (!!req.params.processId) {
            yield connect();
            const dbo = client.db(SGA_DB);
            console.log(process);
            const processId = new mongodb_1.ObjectId(req.params.processId);
            yield dbo.collection("process").deleteOne({ _id: processId }).then((value) => {
                console.log(value);
                const message = value.acknowledged ? "Successfully removed!" : "Nothing removed!";
                result = res.json({ msg: message, data: value });
            }).catch((reason) => {
                console.log(reason);
                const message = "Remove failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({ msg: message, data: reason });
            });
        }
        else {
            result = res.json({ msg: "Process doesn't exist!", data: req.params.processId });
        }
    }
    catch (e) {
        console.log(e);
        result = res.json({ msg: "An error occurred", data: e });
    }
    finally {
        // Ensures that the client will close when you finish/error
        yield client.close();
    }
    return result;
}));
processRoute.patch("/update/:processId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    try {
        if (!!req.params.processId && !!req.body) {
            yield connect();
            const dbo = client.db(SGA_DB);
            const processId = new mongodb_1.ObjectId(req.params.processId);
            const process = req.body;
            yield dbo.collection("process").updateOne({ _id: processId }, { $set: process }).then((value) => {
                console.log(value);
                const message = value.acknowledged ? "Successfully updated!" : "Nothing changed!";
                result = res.json({ msg: message, data: value });
            }).catch((reason) => {
                console.log(reason);
                const message = "Update failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({ msg: message, data: reason });
            });
        }
        else {
            result = res.json({ msg: "Process doesn't exist!", data: req.params.processId });
        }
    }
    catch (e) {
        console.log(e);
        result = res.json({ msg: "An error occurred", data: e });
    }
    finally {
        // Ensures that the client will close when you finish/error
        yield client.close();
    }
    return result;
}));
module.exports = processRoute;
