export interface HalHttpOptions {
    headers?: {
        [header: string]: string | string[];
    };
    params?: {
        [param: string]: string | string[];
    };
}
