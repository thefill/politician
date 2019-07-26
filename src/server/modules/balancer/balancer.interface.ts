import {IEndpointHandlerConfig} from '../base-request-handler';

/**
 * Object with found handler
 */
export interface IEndpointMatchResult {
    endpoint: IEndpointHandlerConfig;
    endUrl: string;
    urlParams: { [paramName: string]: any };
}
