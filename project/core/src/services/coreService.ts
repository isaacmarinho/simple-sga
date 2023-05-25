import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {Result} from "../../../shared/interfaces/Result";
import {Expiration} from "../../../shared/enums/Expiration";
import dayjs, {OpUnitType} from "dayjs";
import * as console from "console";

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

export const processContracts = async () => {

}

export const getContractsSummary = async () => {

}

export const getAllContracts = async (pageNumber: number, limit: number) => {
    try {
        await connect();

        const dbo = client.db(SGA_DB);
        const result: Result = {count: 0, pageNumber: 0, rowsPerPage: 0, data: null, next: null, previous: null};
        const totalProcesses = await dbo.collection("process").countDocuments();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.count = totalProcesses;

        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber > 1 ? pageNumber - 1 : pageNumber,
                limit: limit,
            };
        }

        if (endIndex <= (await dbo.collection("process").countDocuments())) {
            result.next = {
                pageNumber: pageNumber + 2,
                limit: limit,
            };
        }

        result.data = await dbo.collection("process").find({})
            .sort("-_id")
            .skip(startIndex)
            .limit(limit).toArray();
        result.rowsPerPage = limit;

        if (result.count > 0) {
            return {msg: "Process Fetched successfully", data: result};
        } else {
            return {msg: "No process to fetch", data: result};
        }
    } catch (e) {
        console.log(e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

const getUnitType = function (expiration: string | Expiration): OpUnitType {
    switch (expiration) {
        case Expiration.DAY:
            return 'd';
        case Expiration.WEEK:
            return 'w';
        case Expiration.MONTH:
            return 'M';
        default:
            return 'y';
    }
}

export const getMatchExpression = function (expiration: string | Expiration): Object {
    if (!!expiration) {
        let timeUnit: OpUnitType = getUnitType(expiration);
        let start: Date = dayjs().startOf(timeUnit).toDate();
        let end: Date = dayjs().endOf(timeUnit).toDate();
        return {
            '$and': [
                {'valid_until': {'$gte': start}},
                {'valid_until': {'$lte': end}}
            ]
        };
    }
    return {'valid_until': {}};
}

export const getExpiringAndExpiredContracts = async (expiration: string | Expiration, pageNumber: number, limit: number) => {
    try {
        await connect();

        const dbo = client.db(SGA_DB);
        const result: Result = {count: 0, pageNumber: 0, rowsPerPage: 0, data: null, next: null, previous: null};

        const pipeline = [
            {
                '$addFields': {
                    'valid_until': {
                        '$dateAdd': {
                            'startDate': '$valid_since',
                            'unit': 'year',
                            'amount': '$expiration'
                        }
                    }
                }
            }, {
                '$match': getMatchExpression(expiration)
            }];

        const pipelineCount = Array.prototype.concat(pipeline, [{
            $count: "totalDocuments"
        }]);


        const totalProcesses = await dbo.collection("process").aggregate(pipelineCount).toArray();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.count = totalProcesses[0]?.totalDocuments || 0;
        console.log("ITEMS", result.count);
        console.log("START", startIndex);
        console.log("END", endIndex);
        console.log("LASTPAGE", result.count / limit);


        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber > 1 ? pageNumber - 1 : pageNumber,
                limit: limit,
            };
        }

        if (endIndex <= ((await dbo.collection("process").aggregate(pipelineCount).toArray())[0]?.totalDocuments || 0)) {
            result.next = {
                pageNumber: pageNumber + 2,
                limit: limit,
            };
        }

        result.data = await dbo.collection("process").aggregate(pipeline)
            .sort({"_id": -1})
            .skip(startIndex)
            .limit(limit).toArray();
        result.rowsPerPage = limit;

        if (result.count > 0) {
            return {msg: "Process Fetched successfully", data: result};
        } else {
            return {msg: "No process to fetch", data: result};
        }
    } catch (e) {
        console.log(e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
