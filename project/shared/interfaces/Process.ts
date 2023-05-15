export interface Process {
  _id: string;
  project: string;
  name: string;
  status: string;
  valid_since: Date;
  expiration: number;
}