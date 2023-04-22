import dotenv from "dotenv";

dotenv.config();

export const AWS_CONFIG = {
    key: process.env.AWS_ACCESS_KEY_ID || "",
    secret: process.env.AWS_SECRET_ACCESS_KEY || "",
    ses: {
        from: {
            // replace with actual email address
            default: 'simple.sga@gmail.com'
        },
        // e.g. us-west-2
        region: 'us-east-1'
    }
}