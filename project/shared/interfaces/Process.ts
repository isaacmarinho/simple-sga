export interface Process {
    _id: Object | undefined;
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