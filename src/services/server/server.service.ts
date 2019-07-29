import * as bodyParser from 'body-parser';
import cors from 'cors';
import ExpressServer, {Application, NextFunction, Request, Response} from 'express';
import {IInjection, jetli} from 'jetli';
import * as os from "os";
import {BalancerService} from '../balancer';

/**
 * Main server module that serves mocked content
 */
export class ServerService implements IInjection {
    public initialised = false;

    // Port we listen to, use provided port via process.env.MOCK_API_PORT, defaults to 3000
    public port: number;
    // IP we listen to, use provided port via process.env.MOCK_API_PORT, defaults to 3000
    public ip: string;
    // Base service url provided via process.env.MOCK_API_BASE_URL, defaults to 'api'
    public urlBase: string;
    // Main serever
    protected server: Application;
    // Balancer that routes requests to specific service mocks
    protected balancer: BalancerService;

    /**
     * Create new server
     */
    constructor(
        port: number,
        urlBase: string
    ) {
        // TODO: accept list of paths to static files and add them in setup (loop + app.use path >
        // response.sendfile(__dirname + '/index.html');)
        this.port = port;
        this.urlBase = urlBase;
        this.ip = this.getIp();

        // Create and setup server
        this.server = ExpressServer();
    }

    /**
     * Start server
     * @return {Promise<any>}
     */
    public async init(): Promise<void> {
        this.balancer = await jetli.get(BalancerService);
        // resolve on server setup completed
        await this.setupServer();
        this.initialised = true;
    }

    /**
     * Returns ip server is operating on
     * @returns {string}
     */
    protected getIp(): string {
        const networkInterfaces = os.networkInterfaces();
        const ips: string[] = [];

        // Extract IP
        Object.keys(networkInterfaces)
            .forEach((name) => {
                networkInterfaces[name].forEach((networkInterface) => {
                    if ('IPv4' !== networkInterface.family || networkInterface.internal) {
                        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                        return;
                    }
                    ips.push(networkInterface.address);
                });
            });

        // get last one (as usually its 192...)
        return ips[ips.length - 1];
    }

    /**
     * Setup server
     */
    protected setupServer() {
        // parse incoming bodies
        this.server.use(bodyParser.json());

        // allow CORS
        this.server.use(cors());

        // serve any trafic that hits urlBase and pass to generic handler
        const catchAllPattern = this.urlBase ? `/${this.urlBase}/*` : `*`;
        this.server.all(catchAllPattern, this.handleAll.bind(this));

        // default error handler
        this.server.use(this.errorHandler.bind(this));

        // default not-found handler
        this.server.use(this.notFoundHandler.bind(this));

        return new Promise((resolve) => {
            // enable server
            this.server.listen(
                this.port,
                () => {
                    // notify that server started
                    resolve();
                }
            );
        });
    }

    /**
     * Handle not-found errors
     * @param {e.Request} request
     * @param {e.Response} response
     * @param {e.NextFunction} next
     */
    protected notFoundHandler(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        response.status(404)
            .send();
        response.end();
    }

    /**
     * Handle errors
     * @param error
     * @param {e.Request} request
     * @param {e.Response} response
     * @param {e.NextFunction} next
     */
    protected errorHandler(
        error: any,
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        response.status(500)
            .send();
        response.end();
    }

    /**
     * Handle all calls
     * @param {e.Request} request
     * @param {e.Response} response
     * @param {e.NextFunction} next
     */
    protected handleAll(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        // pass to balancer
        this.balancer.route(
            request,
            response,
            next
        );
    }
}
