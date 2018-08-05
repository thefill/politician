import { StoreModule } from '../store';
import { IEndpointHandlerConfigs, IRequestHandlerSummary } from './base-request-handler.interface';
export declare abstract class BaseRequestHandler {
    abstract basePath: string;
    abstract endpoints: IEndpointHandlerConfigs;
    protected store: StoreModule<any>;
    constructor(store: StoreModule<any>);
    getSummary(): IRequestHandlerSummary;
}
