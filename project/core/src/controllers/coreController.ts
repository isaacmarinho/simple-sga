import {DeleteResult, Document, InsertOneResult, MongoClient, ObjectId, OptionalId, UpdateResult} from "mongodb";
import dotenv from "dotenv";
import {Request, Response} from "express";
import {getExpiringAndExpiredContracts} from "../services/coreService";
import {Expiration} from "../../../shared/enums/Expiration";

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

exports.process = async (req: Request, res: Response) => {
    try {

        await connect();

        const dbo = client.db(SGA_DB);

        const {query} = req;
        const expiration: string | Expiration = String(query.expiration) || Expiration.YEAR;
        let pageNumber: number = parseInt(String(query.pageNumber)) || 0;
        if (pageNumber > 0) {
            pageNumber -= 1;
        }

        const limit = parseInt(String(query.limit)) || 12;

        await getExpiringAndExpiredContracts(expiration, pageNumber, limit)
            .then((value) => {
                res.status(200).send(value);
            });
    } catch (error) {
        res.status(500).json({error: error});
    }
}