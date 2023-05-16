export interface Process {
    _id: string;
    project: string;
    code: string;
    name: string;
    status: string;
    valid_since: Date;
    expiration: number;
    tags: string[];
    subscribers: string[];
    attachments: string[];
}