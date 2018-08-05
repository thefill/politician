import { NextFunction, Request, Response } from 'express';
export interface IRequestHandlerSummary {
    basePath: string;
    endpoints: string[];
}
export declare type EndpointRequestHandler = (request: Request, response: Response, next: NextFunction, endUrl: string, urlParams: {
    [paramName: string]: any;
}) => void;
export interface IEndpointHandlerConfig {
    handler: EndpointRequestHandler;
    methods: RequestMethods[];
}
export declare enum RequestMethods {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT"
}
export interface IEndpointHandlerConfigs {
    [pathPattern: string]: IEndpointHandlerConfig;
}
