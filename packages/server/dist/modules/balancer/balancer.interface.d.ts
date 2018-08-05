import { IEndpointHandlerConfig } from '../base-request-handler';
export interface IEndpointMatchResult {
    endpoint: IEndpointHandlerConfig;
    endUrl: string;
    urlParams: {
        [paramName: string]: any;
    };
}
