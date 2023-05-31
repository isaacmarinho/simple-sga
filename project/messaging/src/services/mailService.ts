import AWS from "aws-sdk";
import {AWS_CONFIG} from "../awsConfig";

let credentials = new AWS.Credentials(AWS_CONFIG.key, AWS_CONFIG.secret);

credentials.refresh((err) => {
    console.log(err)
});
AWS.config.update({
    credentials: credentials,
    region: AWS_CONFIG.ses.region
});

const ses = new AWS.SES({apiVersion: '2010-12-01'});

export class Mail {
    constructor(
        public to: string,
        public html: string,
        public from: string,
        public subject?: string) {
    }
}

export const sendMail = (mail: Mail) => {

    const params = {
        Destination: {
            ToAddresses: [mail.to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: mail.html
                },
                Text: {
                    Charset: "UTF-8",
                    Data: mail.html
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: mail.subject || "New Mail"
            }
        },
        ReturnPath: mail.from || AWS_CONFIG.ses.from.default,
        Source: mail.from || AWS_CONFIG.ses.from.default
    };
    return new Promise((resolve, reject) => {
        ses.sendEmail(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}