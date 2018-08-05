import { NextFunction, Request, Response } from 'express';
import { BaseRequestHandler, RequestMethods } from '../base-request-handler';
export declare class DashboardService extends BaseRequestHandler {
    basePath: string;
    endpoints: {
        '/': {
            handler: (request: Request, response: Response, next: NextFunction, endUrl: string, urlParams: {
                [paramName: string]: any;
            }) => void;
            methods: RequestMethods[];
        };
        'action/:id': {
            handler: (request: Request, response: Response, next: NextFunction, endUrl: string, urlParams: {
                [paramName: string]: any;
            }) => void;
            methods: RequestMethods[];
        };
    };
}
