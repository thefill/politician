/**
 * Summary of available service
 */
import {NextFunction, Request, Response} from 'express';

export interface IRequestHandlerSummary {
    // Service base path
    basePath: string;
    // Available endpoints
    endpoints: string[];
}

/**
 * Handler for mock requests, we pass all express functions and optional url that contains rest of matched url
 */
export type EndpointRequestHandler = (
    request: Request,
    response: Response,
    next: NextFunction,
    // part of url matched e.g.
    //  - for pathPattern 'baseUrl/planets/:planet'
    //  - and request to 'baseUrl/planets/mars'
    // we will get endUrl '/planets/mars'
    endUrl: string,
    // param data extracted from matched url e.g.
    //  - for pathPattern 'baseUrl/planets/:planet'
    //  - and request to 'baseUrl/planets/mars'
    // we will get {planets: 'mars'}
    urlParams: { [paramName: string]: any }
) => void;

/**
 * Single mocked endpoint
 */
export interface IEndpointHandlerConfig {
    // callback to handle request
    // TODO: add 400,500... request handlers in some way (convert handler to object with handler props?)
    handler: EndpointRequestHandler;
    // accepted methods
    methods: RequestMethods[];
}

/**
 * Request methods
 */
export enum RequestMethods {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT'
}

/**
 * Mock responses per path
 */
export interface IEndpointHandlerConfigs {
    // where path can contain route params and query strings, e.g.
    //  - for patch 'baseUrl/planets/:planet' we will match requests:
    //      baseUrl/planets/earth
    //      baseUrl/planets/earth?fruit=apple#bookmark
    //  - for patch '?foo=:foo&fruit=:fruit' we will match requests:
    //      baseUrl/hello/world?foo=bar&fruit=apple
    //      baseUrl/ignore/what/is/here?fruit=apple&foo=bar
    //  - for patch '#/chapters/:chapter' we will match requests:
    //      baseUrl/#/chapters/5
    //      baseUrl/books/3432?display=full#/chapters/2
    // also provided data will be extracted to... so 'baseUrl/hello/:planet?foo=:foo&fruit=:fruit#:section' will return:
    //      {
    //          params: ["bar", "apple"],
    //          namedParams: { planet: "earth", foo: "bar", fruit: "apple" }
    //          pathParams: { planet: "world" }
    //          queryParams: { foo: "bar", fruit: "apple" }
    //          hashParams: { section: "chapter2" }
    //      }
    [pathPattern: string]: IEndpointHandlerConfig;
}
