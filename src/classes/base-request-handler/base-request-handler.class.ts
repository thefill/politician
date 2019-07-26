import {IEndpointHandlerConfigs, IRequestHandlerSummary} from '../../interfaces';
import {StoreService} from '../../services/store';

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
    protected store: StoreService<any>;

    /**
     * Constructor that accepts store used internally
     * @param store
     */
    constructor(store: StoreService<any>) {
        this.store = store;
    }

    /**
     * Get base request handler service summary
     * @returns {IRequestHandlerSummary}
     */
    public getSummary(): IRequestHandlerSummary {

        const endpoints = Object.keys(this.endpoints).map((key) => {
            return {
                url: key,
                methods: this.endpoints[key].methods
            };
        });

        return {
            basePath: this.basePath,
            endpoints: endpoints
        } as IRequestHandlerSummary;
    }
}
