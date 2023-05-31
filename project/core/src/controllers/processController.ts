import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {Request, Response} from "express";
import {getExpiringAndExpiredContracts, getProcessesSummary} from "../services/coreService";
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
    /// #swagger.start
    /*  #swagger.auto = false
        #swagger.path = '/process'
        #swagger.method = 'get'
        #swagger.description = 'Lista todos os processos ambientais expirados ou em vias de expirar, dada uma janela de tempo.'
        #swagger.parameters['expiration'] = {
            in: 'query',
            type: 'string',
            description: 'Janela de tempo da expiração (DAY,WEEK,MONTH,YEAR - o default é YEAR)' }
        #swagger.parameters['pageNumber'] = {
            in: 'query',
            type: 'integer',
            description: 'Índice da página (iniciando por zero - o default é zero)' }

        #swagger.parameters['limit'] = {
            in: 'query',
            type: 'integer',
            description: 'Número de registros por página (o default é 5)' }
          */
    try {

        await connect();

        const dbo = client.db(SGA_DB);

        const {query} = req;
        const expiration: string | Expiration = String(query.expiration) || Expiration.YEAR;
        let pageNumber: number = parseInt(String(query.pageNumber)) || 0;

        const limit = parseInt(String(query.limit)) || 100;

        await getExpiringAndExpiredContracts(expiration, pageNumber, limit)
            .then((value) => {
                res.status(200).send(value); // #swagger.responses[200]
            });
    } catch (error) {
        res.status(500).json({error: error}); // #swagger.responses[500]
    }
    // #swagger.end
}

exports.summary = async (req: Request, res: Response) => {
    /// #swagger.start
    /*  #swagger.auto = false
        #swagger.path = '/summary/:process_type'
        #swagger.method = 'get'
        #swagger.description = 'Exibe um sumário dos processos ambientais, dada uma janela de tempo.'
        #swagger.parameters['expiration'] = {
            in: 'query',
            type: 'string',
            description: 'Janela de tempo da expiração (DAY,WEEK,MONTH,YEAR - o default é YEAR)' }
        #swagger.parameters['pageNumber'] = {
            in: 'query',
            type: 'integer',
            description: 'Índice da página (iniciando por zero - o default é zero)' }

        #swagger.parameters['limit'] = {
            in: 'query',
            type: 'integer',
            description: 'Número de registros por página (o default é 5)' }
          */
    try {

        const {query} = req;
        const expiration: string | Expiration = String(query.expiration) || Expiration.YEAR;
        let pageNumber: number = parseInt(String(query.pageNumber)) || 0;

        const limit = parseInt(String(query.limit)) || 100;

        await getProcessesSummary(expiration, pageNumber, limit)
            .then((value) => {
                res.status(200).send(value); // #swagger.responses[200]
            });
    } catch (error) {
        res.status(500).json({error: error}); // #swagger.responses[500]
    }
    // #swagger.end
}
