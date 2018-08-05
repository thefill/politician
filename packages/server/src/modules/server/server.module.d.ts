import { NextFunction, Request, Response } from 'express';
import { BalancerService } from '../balancer';
export declare class ServerModule {
    port: number;
    ip: string;
    private server;
    private balancer;
    private urlBase;
    constructor(port: number, urlBase: string, balancer: BalancerService);
    init(): Promise<any>;
    protected getIp(): string;
    protected setupServer(resolve: () => void): void;
    protected notFoundHandler(request: Request, response: Response, next: NextFunction): void;
    protected errorHandler(error: any, request: Request, response: Response, next: NextFunction): void;
    protected handleAll(request: Request, response: Response, next: NextFunction): void;
}
