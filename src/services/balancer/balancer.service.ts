import {NextFunction, Request, Response} from 'express';
import {IInjection, jetli} from 'jetli';
import * as RoutePattern from 'route-pattern';
import {BaseRequestHandler} from '../../classes/base-request-handler';
import {RequestMethods} from '../../enums';
import {IEndpointHandlerConfig, IEndpointMatchResult, IRequestHandlerSummary} from '../../interfaces';
import {StoreService} from '../store';

/**
 * Module routes requests to correct mocked-serviceStore
 */
export class BalancerService implements IInjection {
    public initialised = false;
    protected baseUrl: string;
    protected serviceStore: StoreService<BaseRequestHandler>;
    protected dataStoreService: StoreService<any>;
    protected requestServices: StoreService<new (store: StoreService<any>) => BaseRequestHandler>;

    /**
     * Constructor
     */
    constructor(
        baseUrl: string,
        requestServices: StoreService<new (store: StoreService<any>) => BaseRequestHandler>
    ) {
        this.baseUrl = baseUrl;
        this.requestServices = requestServices;
    }

    public async init(): Promise<void> {
        this.dataStoreService = await jetli.get(StoreService);
        // create instantiate all serviceStore
        this.serviceStore = this.createRequestServices(this.requestServices);
        this.initialised = true;
    }

    /**
     * Route request to correct service
     * @param {e.Request} request
     * @param {e.Response} response
     * @param {e.NextFunction} next
     */
    public route(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {
        // TODO: what about websocket???
        // get request method and url without base
        const method: RequestMethods = request.method as RequestMethods;
        // compensate for base url
        const url = this.baseUrl ? request.url.substr(this.baseUrl.length + 2) : request.url.substr(1);

        // find service handler for matching url and let it handle request from there, else 404
        const endpointConfig = this.findEndpoint(method, url);
        if (endpointConfig && endpointConfig.endpoint) {
            endpointConfig.endpoint.handler(
                request,
                response,
                next,
                endpointConfig.endUrl,
                endpointConfig.urlParams
            );
        } else {
            next();
        }
    }

    /**
     * Retrieve list of available service mocks
     * @returns {IRequestHandlerSummary[]}
     */
    public getAvailableMocks(): IRequestHandlerSummary[] {
        return this.serviceStore.keys()
            .map((key) => {
                const summary = this.serviceStore.get(key)
                    .getSummary();
                return {
                    basePath: summary.basePath,
                    endpoints: summary.endpoints
                };
            });
    }

    /**
     * Find endpoint that matches url
     * @param method
     * @param url
     */
    protected findEndpoint(
        method: RequestMethods,
        url: string
    ): IEndpointMatchResult | void {
        const urlPartials = url.split('/');

        console.log(urlPartials);
        // get first service that have base path
        const serviceKey = this.serviceStore.keys()
            .find((key) => {
                return this.serviceStore.get(key).basePath === urlPartials[0];
            });

        if (!serviceKey) {
            return;
        }
        const service = this.serviceStore.get(serviceKey);

        // remove basePath for further processing
        urlPartials.shift();

        // get first service method that matches rest of partials
        // and get data based on defined path (see EndpointRequestHandler definition for more details)
        const requestUrl = urlPartials.join('/');
        const extractedUrlParams = {};
        const endpointKey = Object.keys(service.endpoints)
            .find((route) => {
                const routePattern = RoutePattern.fromString(route);

                // does route and requestUrl match?
                const match = routePattern.match(requestUrl);
                if (match) {
                    // get data
                    Object.assign(
                        extractedUrlParams,
                        match.namedParams
                    );
                    return true;
                } else {
                    return false;
                }
            });

        if (!endpointKey) {
            return;
        }
        const endpoint: IEndpointHandlerConfig = service.endpoints[endpointKey];

        // return handler config
        return {
            endpoint,
            endUrl: requestUrl.substr(endpointKey.length),
            urlParams: extractedUrlParams
        };
    }

    /**
     * Create services from provided store of service constructors
     * @param services
     */
    protected createRequestServices(
        services: StoreService<new (store: StoreService<any>) => BaseRequestHandler>
    ): StoreService<BaseRequestHandler> {
        const initialValues = {};
        services.keys()
            .forEach((key) => {
                const service = services.get(key);
                initialValues[key] = new service(this.dataStoreService);
            });

        return new StoreService<BaseRequestHandler>(initialValues);
    }
}
