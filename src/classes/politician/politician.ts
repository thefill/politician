import * as Chalk from 'chalk';
import {IInjection, jetli} from 'jetli';
import {IPoliticianConfig} from '../../interfaces/politician';
import {IRequestHandlerSummary} from '../../interfaces/request-handler';
import {BalancerService} from '../../services/balancer';
import {DashboardService} from '../../services/dashboard';
import {ServerService} from '../../services/server';
import {StoreService} from '../../services/store';
import {BaseRequestHandler} from '../base-request-handler';
import {DashboardRequestHandler} from '../dashboard-request-handler';

const color = Chalk.default;

/**
 * Main app module
 */
export class Politician implements IInjection {
    public initialised = false;
    protected availableRequestServices: StoreService<new (store: StoreService<any>) => BaseRequestHandler>;
    protected port = 3000;
    protected urlBase = '';
    protected dashboardEnabled = true;
    // Main server
    protected serverService: ServerService;
    // Balancer that routes requests to specific service mocks
    protected balancerService: BalancerService;
    // Global store for data
    protected dataStoreService: StoreService<any>;
    // Global dashboard service executed same as mocked services via balancer
    protected dashboardService: DashboardService;

    /**
     * Create new server
     */
    constructor(
        config: IPoliticianConfig
    ) {
        this.applyConfig(config);
    }

    public async init(): Promise<void> {
        // create store
        this.dataStoreService = await jetli.get(StoreService);

        if (this.dashboardEnabled) {
            // include dashboard service
            this.dashboardService = await jetli.get(DashboardService);

            this.availableRequestServices.set(
                'DashboardService',
                DashboardRequestHandler
            );

        }

        this.balancerService = await jetli.get(
            BalancerService,
            this.urlBase,
            this.availableRequestServices
        );

        // Instantiate server
        this.serverService = await jetli.get(ServerService, this.port, this.urlBase);

        // get service summary, exclude dashboard service
        const summary = this.balancerService.getAvailableMocks();
        // .filter((available) => {
        //     return available.basePath !== DashboardService.basePath;
        // });
        this.printSummary(summary);
        this.initialised = true;
    }

    /**
     * Print nice list of service + endpoints
     * @param available
     */
    protected printSummary(
        available: IRequestHandlerSummary[]
    ) {
        // exclude dashboard request service
        const printableServices = available.filter((entry) => {
            return entry.basePath !== DashboardService.basePath;
        });

        // parse available mocked-services to colorful list
        // TODO: add methods available for urls
        const parsedAvailable = printableServices.map((service) => {
            // prettify name
            const name = color.magenta(` ⇄ ${service.basePath}/\r\n`);
            // prettify endpoints
            let flattenedEndpoints = '';
            if (service.endpoints && service.endpoints.length) {
                const endpointsAndMethods = service.endpoints.map((entry) => {
                    return `${entry.url}${color.grey(` | ${entry.methods.join(', ')}`)}`;
                });
                flattenedEndpoints = color.yellow('   ⤷ ' + endpointsAndMethods.join('\r\n   ⤷ '));
            }
            return name + flattenedEndpoints;
        });
        const baseUrl = this.serverService.urlBase ? `/${this.serverService.urlBase}` : '';

        /* tslint:disable */
        console.log(color.grey('--------------------------------------------------------\r\n'));
        console.log(color.grey('Mock server listens on:'));
        console.log(
            color.green(`http://localhost:${this.serverService.port as any}${baseUrl}`),
            color.grey('|'),
            color.green(`http://${this.serverService.ip}:${this.serverService.port as any}${baseUrl}`),
            '\r\n'
        );

        if (this.dashboardEnabled) {
            console.log(color.grey('Dashboard url:'));
            console.log(
                color.green(`http://localhost:${this.serverService.port as any}${baseUrl}/${DashboardService.basePath}`),
                color.grey('|'),
                color.green(
                    `http://${this.serverService.ip}:${this.serverService.port as any}${baseUrl}/${DashboardService.basePath}`),
                '\r\n'
            );
        }
        console.log(color.grey('--------------------------------------------------------\r\n'));
        console.log(color.grey('Available mocks:'));
        console.log(parsedAvailable.join('\r\n'));
        console.log(
            '\r\n',
            color.grey('--------------------------------------------------------\r\n')
        );
        /* tslint:enable */
    }

    protected applyConfig(config: IPoliticianConfig) {
        this.availableRequestServices = config.availableRequestServices;
        this.port = config.port ? config.port : this.port;
        this.urlBase = config.urlBase ? config.urlBase : this.urlBase;
        this.dashboardEnabled = typeof config.dashboardEnabled !== 'undefined' ?
            config.dashboardEnabled : this.dashboardEnabled;
    }

}
