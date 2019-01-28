import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as Server from 'express';
import {Application, NextFunction, Request, Response} from 'express';
import * as os from "os";
import {BalancerService} from '../balancer';

/**
 * Main server module that serves mocked content
 */
export class ServerModule {

    // Port we listen to, use provided port via process.env.MOCK_API_PORT, defaults to 3000
    public port: number;
    // IP we listen to, use provided port via process.env.MOCK_API_PORT, defaults to 3000
    public ip: string;
    // Main serever
    private server: Application;
    // Balancer that routes requests to specific service mocks
    private balancer: BalancerService;
    // Base service url provided via process.env.MOCK_API_BASE_URL, defaults to 'api'
    private readonly urlBase: string | void;

    /**
     * Create new server
     * @param {BalancerService} balancer
     * @param {number} port  service port, defaults to 3000
     * @param {string} urlBase base service url, defaults to none
     */
    constructor(
        balancer: BalancerService,
        port = 3000,
        urlBase?: string
    ){
        // TODO: accept list of paths to static files and add them in setup (loop + app.use path >
        // response.sendfile(__dirname + '/index.html');)
        this.port = port;
        this.urlBase = urlBase;
        this.balancer = balancer;
        this.ip = this.getIp();

        // Create and setup server
        this.server = Server();
    }

    /**
     * Start server
     * @return {Promise<any>}
     */
    public init(): Promise<any>{
        // resolve on server setup completed
        return new Promise((resolve) => {
            this.setupServer(resolve);
        });
    }

    /**
     * Returns ip server is operating on
     * @returns {string}
     */
    protected getIp(): string{
        const networkInterfaces = os.networkInterfaces();
        const ips: string[] = [];

        // Extract IP
        Object.keys(networkInterfaces)
            .forEach((name) => {
                networkInterfaces[name].forEach((networkInterface) => {
                    if ('IPv4' !== networkInterface.family || networkInterface.internal){
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
     * @param resolve
     */
    protected setupServer(resolve: () => void){
        // parse incoming bodies
        this.server.use(bodyParser.json());

        // allow CORS
        this.server.use(cors());

        // build url catch rule
        const catchRule = this.urlBase && this.urlBase.length ? `/${this.urlBase}/*` : `/*`;

        // serve any trafic that hits urlBase and pass to generic handler
        this.server.all(
            catchRule,
            this.handleAll.bind(this)
        );

        // default error handler
        this.server.use(this.errorHandler.bind(this));

        // default not-found handler
        this.server.use(this.notFoundHandler.bind(this));

        // enable server
        this.server.listen(
            this.port,
            () => {
                // notify that server started
                resolve();
            }
        );
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
    ){
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
    ){
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
    ){
        // pass to balancer
        this.balancer.route(
            request,
            response,
            next
        );
    }
}
