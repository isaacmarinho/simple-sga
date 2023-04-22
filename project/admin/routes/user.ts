import {MongoClient, ObjectId} from "mongodb";

import {Request, Response, Router} from "express";
import {Result} from "../../shared/interfaces/Result";
import dotenv from "dotenv";
import {User} from "../../shared/interfaces/User";


const userRoute = Router();

dotenv.config();

const DB_HOST = process.env.DATABASE_SERVER_NAME;
const DB_PORT = process.env.DATABASE_SERVER_PORT;
const DB_USER = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DEFAULT_DB = process.env.DATABASE_NAME;
const SGA_DB = process.env.SGA_DATABASE_NAME;

// Connection URI
const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;

// Create a new MongoClient
const client = new MongoClient(uri);

async function connect() {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db(DEFAULT_DB).command({ping: 1});
    console.log("Connected successfully to server");
}

userRoute.get("/", async (req: Request, res: Response) => {
    let resultSet = null;
    try {

        await connect();

        const dbo = client.db(SGA_DB);

        const {query} = req;
        let pageNumber: number = parseInt(String(query.pageNumber)) || 0;
        if (pageNumber > 0) {
            pageNumber -= 1;
        }

        const limit = parseInt(String(req.query.limit)) || 12;
        const result: Result = {count: 0, rowsPerPage: 0, data: null, next: null, previous: null};
        const totalUsers = await dbo.collection("users").countDocuments();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.count = totalUsers;

        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber > 1 ? pageNumber - 1 : pageNumber,
                limit: limit,
            };
        }

        if (endIndex <= (await dbo.collection("users").countDocuments())) {
            result.next = {
                pageNumber: pageNumber + 2,
                limit: limit,
            };
        }

        result.data = await dbo.collection("users").find({})
            .sort("-_id")
            .skip(startIndex)
            .limit(limit).toArray();
        result.rowsPerPage = limit;

        if (result.count > 0) {
            resultSet = res.json({msg: "Users Fetched successfully", data: result});
        } else {
            resultSet = res.json({msg: "No users to fetch", data: result});
        }
    } catch (e) {
        console.log(e);
        resultSet = res.json({msg: "An error occurred", data: e});
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    return resultSet;
})

userRoute.post("/add", async (req, res) => {
    let result = null;
    try {
        if (req.body) {
            await connect();
            const dbo = client.db(SGA_DB);
            const user: User = req.body;
            console.log(user);
            await dbo.collection("users").insertOne(user).then((value) => {
                const message = value.acknowledged ? "Successfully added!" : "Nothing added!";
                result = res.json({msg: message, data: value});
            }).catch((reason: any) => {
                console.log(reason);
                const message = "Create failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({msg: message, data: reason});
            });
        } else {
            result = res.json({msg: "No user to add!", data: req.body});
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

userRoute.delete("/remove/:userId", async (req, res) => {
    let result = null;
    try {
        if (!!req.params.userId) {
            await connect();
            const dbo = client.db(SGA_DB);
            const userId: ObjectId = new ObjectId(req.params.userId)
            await dbo.collection("users").deleteOne({_id: userId}).then((value) => {
                console.log(value);
                const message = value.acknowledged ? "Successfully removed!" : "Nothing removed!";
                result = res.json({msg: message, data: value});
            }).catch((reason: any) => {
                console.log(reason);
                const message = "Delete failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({msg: message, data: reason});
            });
        } else {
            result = res.json({msg: "User doesn't exist!", data: req.params.userId});
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

userRoute.patch("/update/:userId", async (req, res) => {
    let result = null;
    try {

        if (!!req.params.userId && !!req.body) {
            await connect();
            const dbo = client.db(SGA_DB);
            const userId: ObjectId = new ObjectId(req.params.userId);
            const userFields: Partial<User> = req.body;
            console.log(userFields);

            await dbo.collection("users").updateOne({_id: userId}, {$set: userFields}).then((value) => {
                console.log(value);
                const message = value.acknowledged ? "Successfully updated!" : "Nothing changed!";
                result = res.json({msg: message, data: value});

            }).catch((reason) => {
                console.log(reason);
                const message = "Update failed! \nReason: " + (!!reason ? reason : "Unknown reason.");
                result = res.json({msg: message, data: reason});
            });
        } else {
            result = res.json({msg: "User doesn't exist!", data: req.params.userId});
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

module.exports = userRoute