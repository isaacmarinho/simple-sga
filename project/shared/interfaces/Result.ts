export interface Result {
    count: number;
    rowsPerPage: number;
    previous: { pageNumber: number, limit: number } | null;
    next: { pageNumber: number, limit: number } | null;
    data: any;
}