import {NextFunction, Request, Response} from 'express';

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
