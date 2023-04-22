import * as console from "console";
import * as schedule from 'node-schedule';

const app = require("./app");
const axios = require('axios')

const port = process.env.PORT || 3015;

let processing: boolean = false;

const postMessage = function (queue: String, email: String[], subject: String, messageBody: String) {
    const message = {
        "queueName": "environmental-queue",
        "payload": {
            "recipients": ["isaacmarinho@gmail.com"],
            "from": "",
            "subject": "Expiring Environmental process",
            "body": `This is a test.\n${messageBody}\nCheers`
        }
    };

    axios.post("http://localhost:3010/message", message).then((response: any) => {
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
    axios.get(`http://localhost:${port}/core/process/?pageNumber=${pageNumber}&limit=1&expiration=year`)
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
                            ["isaacmarinho@gmail.com"],
                            "Expiring Environmental Processes",
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

app.listen(port, () => {
    console.log(`Core server listening on port ${port}`);
    const job = schedule.scheduleJob('0/1 * * * *', async function (fireDate: any) {
        console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
        if (!processing) {
            await processData(1);
        } else {
            console.log("Processing already");
        }
    });
    job.addListener('success', () => {
        console.log(`Core job successfully invoked at ${new Date().toDateString()}`);
    });
});
