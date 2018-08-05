import { BaseRequestHandler, IRequestHandlerSummary } from '../base-request-handler';
import { DashboardService } from '../dashboard';
import { StoreModule } from '../store';
export declare class AppModule {
    private server;
    private readonly balancer;
    private readonly dataStore;
    private readonly dashboardService;
    constructor(availableServices: StoreModule<new (store: StoreModule<any>) => BaseRequestHandler>);
    protected createServices(services: StoreModule<new (store: StoreModule<any>) => BaseRequestHandler>): StoreModule<BaseRequestHandler>;
    protected createDashboardService(): DashboardService;
    protected printSummary(available: IRequestHandlerSummary[]): void;
}
