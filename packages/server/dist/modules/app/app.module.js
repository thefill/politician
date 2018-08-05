"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chalk = require("chalk");
const balancer_1 = require("../balancer");
const dashboard_1 = require("../dashboard");
const server_1 = require("../server");
const store_1 = require("../store");
const color = Chalk.default;
class AppModule {
    constructor(availableServices) {
        const port = process.env.MOCK_API_PORT ? parseInt(process.env.MOCK_API_PORT, 10) : 3000;
        const urlBase = process.env.MOCK_API_BASE_URL ? process.env.MOCK_API_BASE_URL : 'api';
        this.dataStore = new store_1.StoreModule({});
        const services = this.createServices(availableServices);
        this.dashboardService = this.createDashboardService();
        services.set('dashboardService', this.dashboardService);
        this.balancer = new balancer_1.BalancerService(urlBase, services);
        this.server = new server_1.ServerModule(port, urlBase, this.balancer);
        this.server.init()
            .then(() => {
            const summary = this.balancer.getAvailableMocks()
                .filter((available) => {
                return available.basePath !== this.dashboardService.basePath;
            });
            this.printSummary(summary);
        });
    }
    createServices(services) {
        const initialValues = {};
        services.keys()
            .forEach((key) => {
            const service = services.get(key);
            initialValues[key] = new service(this.dataStore);
        });
        return new store_1.StoreModule(initialValues);
    }
    createDashboardService() {
        return new dashboard_1.DashboardService(this.dataStore);
    }
    printSummary(available) {
        const parsedAvailable = available.map((service) => {
            const name = color.magenta(' ⇄ ' + service.basePath) + '\r\n';
            let endpoints = service.endpoints;
            endpoints = endpoints && endpoints.length ?
                color.yellow('   ⤷ ' + service.endpoints.join('\r\n   ⤷ ')) : '';
            return name + endpoints;
        })
            .join('\r\n');
        console.log(color.grey('--------------------------------------------------------\r\n'));
        console.log(color.grey('Mock server listens on:'));
        console.log(color.green(`http://localhost:${this.server.port}`), color.grey('|'), color.green(`http://${this.server.ip}:${this.server.port}`), '\r\n');
        console.log(color.grey('Dashboard url:'));
        console.log(color.green(`http://localhost:${this.server.port}/${this.dashboardService.basePath}`), color.grey('|'), color.green(`http://${this.server.ip}:${this.server.port}/${this.dashboardService.basePath}`), '\r\n');
        console.log(color.grey('--------------------------------------------------------\r\n'));
        console.log(color.grey('Available mocks:'));
        console.log(parsedAvailable);
        console.log('\r\n', color.grey('--------------------------------------------------------\r\n'));
    }
}
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map