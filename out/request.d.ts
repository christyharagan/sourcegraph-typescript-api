export declare type SGCreds = {
    sg_host: string;
    sg_token: string;
};
export declare function make_request<T>({ sg_host, sg_token }: SGCreds, query: string): Promise<T>;
