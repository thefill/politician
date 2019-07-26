import * as Chalk from 'chalk';
import {BalancerService} from '../balancer';
import {BaseRequestHandler, IRequestHandlerSummary} from '../base-request-handler';
import {DashboardService} from '../dashboard';
import {ServerModule} from '../server';
import {StoreModule} from '../store';

const color = Chalk.default;

/**
 * Main app module
 */
export class AppModule {
    // Main server
    protected server: ServerModule;
    // Balancer that routes requests to specific service mocks
    protected readonly balancer: BalancerService;
    // Global store for data
    protected readonly dataStore: StoreModule<any>;
    // Global dashboard service executed same as mocked services via balancer
    protected readonly dashboardService: DashboardService;

    /**
     * Create new server
     */
    constructor(
        availableServices: StoreModule<new (store: StoreModule<any>) => BaseRequestHandler>,
        port: number = 3000,
        urlBase: string = 'api'
    ) {
        // Set port we listen to, use provided port via process.env.MOCK_API_PORT, defaults to 3000
        port = port ? port : parseInt(
            process.env.MOCK_API_PORT as string,
            10
        );

        // set base service url provided via process.env.MOCK_API_BASE_URL, defaults to 'api'
        urlBase = urlBase ? urlBase : process.env.MOCK_API_BASE_URL as string;

        // create store
        this.dataStore = new StoreModule({});

        // instantiate services and pass them to the balancer
        const services = this.createServices(availableServices);
        // include dashboard service
        this.dashboardService = this.createDashboardService();
        services.set(
            'dashboardService',
            this.dashboardService
        );
        this.balancer = new BalancerService(
            urlBase,
            services
        );

        // Instantiate server
        this.server = new ServerModule(
            port,
            urlBase,
            this.balancer
        );
        this.server.init()
            .then(() => {
                // get service summary, exclude dashboard service
                const summary = this.balancer.getAvailableMocks()
                    .filter((available) => {
                        return available.basePath !== this.dashboardService.basePath;
                    });
                this.printSummary(summary);
            });
    }

    /**
     * Create services from provided store of service constructors
     * @param services
     */
    protected createServices(
        services: StoreModule<new (store: StoreModule<any>) => BaseRequestHandler>
    ): StoreModule<BaseRequestHandler> {
        const initialValues = {};
        services.keys()
            .forEach((key) => {
                const service = services.get(key);
                initialValues[key] = new service(this.dataStore);
            });

        return new StoreModule<BaseRequestHandler>(initialValues);
    }

    /**
     * Create system dashboard service
     * @returns {BaseRequestHandler}
     */
    protected createDashboardService(): DashboardService {
        return new DashboardService(this.dataStore);
    }

    /**
     * Print nice list of service + endpoints
     * @param available
     */
    protected printSummary(
        available: IRequestHandlerSummary[]
    ) {
        // parse available mocked-services to colorful list
        // TODO: add methods available for urls
        const parsedAvailable = available.map((service) => {
                // prettify name
                const name = color.magenta(' ⇄ ' + service.basePath) + '\r\n';
                // prettify endpoints
                let endpoints: any = service.endpoints;
                endpoints = endpoints && endpoints.length ?
                    color.yellow('   ⤷ ' + service.endpoints.join('\r\n   ⤷ ')) : '';
                return name + endpoints;
            })
            .join('\r\n');
        const baseUrl = this.server.urlBase ? `/${this.server.urlBase}` : '';

        /* tslint:disable */
        console.log(color.grey('--------------------------------------------------------\r\n'));
        console.log(color.grey('Mock server listens on:'));
        console.log(
            color.green(`http://localhost:${this.server.port as any}${baseUrl}`),
            color.grey('|'),
            color.green(`http://${this.server.ip}:${this.server.port as any}${baseUrl}`),
            '\r\n'
        );
        console.log(color.grey('Dashboard url:'));
        console.log(
            color.green(`http://localhost:${this.server.port as any}/${this.dashboardService.basePath}`),
            color.grey('|'),
            color.green(`http://${this.server.ip}:${this.server.port as any}/${this.dashboardService.basePath}`),
            '\r\n'
        );
        console.log(color.grey('--------------------------------------------------------\r\n'));
        console.log(color.grey('Available mocks:'));
        console.log(parsedAvailable);
        console.log(
            '\r\n',
            color.grey('--------------------------------------------------------\r\n')
        );
        /* tslint:enable */
    }
}
