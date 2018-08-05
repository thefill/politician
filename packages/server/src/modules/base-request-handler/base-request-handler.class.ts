import {StoreModule} from '../store';
import {IEndpointHandlerConfigs, IRequestHandlerSummary} from './base-request-handler.interface';

/**
 * Base class for request handlers, used by mocked services and dahsboard service
 */
export abstract class BaseRequestHandler {
    // Service base - used to build url to match against e.g. 'some-service' will generate '/api/some-service/endpoint'
    public abstract basePath: string;
    // Available endpoints
    public abstract endpoints: IEndpointHandlerConfigs;
    /**
     * Global store shared across all services
     */
    protected store: StoreModule<any>;

    /**
     * Constructor that accepts store used internally
     * @param store
     */
    constructor(store: StoreModule<any>) {
        this.store = store;
    }

    /**
     * Get base request handler service summary
     * @returns {IRequestHandlerSummary}
     */
    public getSummary(): IRequestHandlerSummary {
        return {
            basePath: this.basePath,
            endpoints: Object.keys(this.endpoints)
        } as IRequestHandlerSummary;
    }
}
