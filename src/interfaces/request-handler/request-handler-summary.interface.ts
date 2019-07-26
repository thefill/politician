import {IRequestHandlerSummaryEndpoint} from './request-handler-summary-endpoint.interface';

/**
 * Summary of available service
 */
export interface IRequestHandlerSummary {
    // Service base path
    basePath: string;
    // Available endpoints
    endpoints: IRequestHandlerSummaryEndpoint[];
}
