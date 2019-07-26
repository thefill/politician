import {BaseRequestHandler} from '../../classes/base-request-handler';
import {StoreService} from '../../services/store';

export interface IPoliticianConfig {
    availableRequestServices: StoreService<new (store: StoreService<any>) => BaseRequestHandler>;
    port?: number;
    urlBase?: string;
    dashboardEnabled?: boolean;
}
