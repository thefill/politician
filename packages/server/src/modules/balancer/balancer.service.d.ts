import { NextFunction, Request, Response } from 'express';
import { BaseRequestHandler, IRequestHandlerSummary, RequestMethods } from '../base-request-handler';
import { StoreModule } from '../store';
import { IEndpointMatchResult } from './balancer.interface';
export declare class BalancerService {
    protected baseUrl: string;
    protected serviceStore: StoreModule<BaseRequestHandler>;
    constructor(baseUrl: string, services: StoreModule<BaseRequestHandler>);
    route(request: Request, response: Response, next: NextFunction): void;
    getAvailableMocks(): IRequestHandlerSummary[];
    protected findEndpoint(method: RequestMethods, url: string): IEndpointMatchResult | void;
}
