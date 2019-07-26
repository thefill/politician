import {IEndpointHandlerConfig} from './endpoint-handler-config.interface';

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
    //  - also provided data will be extracted too...
    //    so 'baseUrl/hello/:planet?foo=:foo&fruit=:fruit#:section' will return:
    //      {
    //          params: ["bar", "apple"],
    //          namedParams: { planet: "earth", foo: "bar", fruit: "apple" }
    //          pathParams: { planet: "world" }
    //          queryParams: { foo: "bar", fruit: "apple" }
    //          hashParams: { section: "chapter2" }
    //      }
    [pathPattern: string]: IEndpointHandlerConfig;
}
