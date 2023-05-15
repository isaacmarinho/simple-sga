export interface Process {
  project: string;
  name: string;
  status: string;
  valid_since: Date;
  expiration: number;
}