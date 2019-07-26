import {RequestMethods} from '../../enums';
import {EndpointRequestHandler} from './endpoint-request-handler.interface';

/**
 * Single mocked endpoint
 */
export interface IEndpointHandlerConfig {
    // callback to handle request
    handler: EndpointRequestHandler;
    // accepted methods
    methods: RequestMethods[];
}
