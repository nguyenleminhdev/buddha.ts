export interface Cb {
    (error?: any, result?: any): void
}
export interface CbError {
    (error?: any): void
}