import * as console from "console";
import * as schedule from 'node-schedule';

const app = require("./app");
const axios = require('axios')

const SERVER_NAME = process.env.SERVER_NAME || "localhost";
const PORT = parseInt(process.env.PORT || "3015", 10);
const messaging_endpoint: string = process.env.MESSAGING_ENDPOINT || "http://localhost:3010/messaging";

let processing: boolean = false;

const postMessage = function (queue: String, email: String[], subject: String, messageBody: String) {
    const message = {
        "queueName": "environmental-queue",
        "payload": {
            "recipients": email,
            "from": "",
            "subject": subject,
            "body": `This is a test.\n${messageBody}\nCheers`
        }
    };

    axios.post(`${messaging_endpoint}/message`, message).then((response: any) => {
        if (!!response && response.status) {
            console.log(response.response);
        } else {
            console.log("Something went wrong...");
        }
    }).catch((error: any) => {
        console.log(`Message failed due to:\n${error}`)
    });
}

const getExpiredOrExpiringExcerpt = function (validUntil: Date): String {
    return validUntil > new Date() ? "is about to expire" : "expired";
}

const processData = async function (pageNumber: number) {
    processing = true;
    console.log("Page", pageNumber);
    axios.get(`http://localhost:${PORT}/core/process/?pageNumber=${pageNumber}&limit=50&expiration=YEAR`)
        .then((response: any) => {
            console.log("DATA", response.data);
            if (!!response.data && response.data.data.count > 0) {
                let processes = response.data.data;
                let next = processes.next;
                console.log("PROCESSES", processes);
                processes.data.forEach((process: any) => {
                    console.log("PostMessage start.");

                    setTimeout(() => {
                        postMessage("environmental-queue",
                            processes.subscribers,
                            `[Expiring Environmental Processes] ${process.project}/${process.name}`,
                            `<p>Process ${process.project}/${process.name} ${getExpiredOrExpiringExcerpt(new Date(process.valid_until))}!</p>
                                <h3>Check it out...</h3>
                                <p><strong>Valid Since:</strong> ${new Date(process.valid_since).toLocaleDateString('en-GB')}</p>
                                <p><strong>Valid Util:</strong> ${new Date(process.valid_until).toLocaleDateString('en-GB')}</p>`);
                        console.log("PostMessage end.");

                    }, 2000);

                });
                if (!!next) {

                    setTimeout(() => {
                        processData(next.pageNumber);
                    }, 2000);
                } else {
                    processing = false;
                }
            }
        }).catch((error: any) => console.log(`Couldn't retrieve data due to:\n${error}`));
}

app.addListener('close', () => {
    console.log(`Core server is closing...`);
    try {
        schedule.gracefulShutdown();
    } catch (error) {
        console.log(`Scheduler couldn't shutdown due to:\n${error}`);
    }
})

app.listen(PORT, SERVER_NAME, () => {
    console.log(`Core server listening on port ${PORT}`);
    const job = schedule.scheduleJob('0/1 * * * *', async function (fireDate: any) {
        console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
        if (!processing) {
            await processData(0);
        } else {
            console.log("Processing already");
        }
    });
    job.addListener('success', () => {
        console.log(`Core job successfully invoked at ${new Date().toDateString()}`);
    });
});
