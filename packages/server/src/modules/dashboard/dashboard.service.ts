import {NextFunction, Request, Response} from 'express';
import {BaseRequestHandler, RequestMethods} from '../base-request-handler';

// TODO: server should serve app on /dashboard/ that allows:
// - disabling service mocks
// - changing served data per endpoint
// - changing response code per endpoint
// - list calls
export class DashboardService extends BaseRequestHandler {
    // TODO: complete
    public basePath = 'dashboard';
    public endpoints = {
        '/': {
            handler: (
                request: Request,
                response: Response,
                next: NextFunction,
                endUrl: string,
                urlParams: { [paramName: string]: any }
            ) => {
                // TODO: serve website
                response.status(200)
                    .send({
                        handler: 'dashboard root',
                        endUrl: endUrl,
                        urlParams: urlParams
                    });
            },
            methods: [RequestMethods.GET]
        },
        'action/:id': {
            handler: (
                request: Request,
                response: Response,
                next: NextFunction,
                endUrl: string,
                urlParams: { [paramName: string]: any }
            ) => {
                response.status(200)
                    .send({
                        handler: 'mobility-tasks',
                        endUrl: endUrl,
                        urlParams: urlParams
                    });
            },
            methods: [RequestMethods.GET]
        }
    };
}
