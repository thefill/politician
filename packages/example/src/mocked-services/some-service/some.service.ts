import {BaseRequestHandler, RequestMethods} from '@politician/server';
import {NextFunction, Request, Response} from 'express';

export class SomeService extends BaseRequestHandler {
    // TODO: complete
    // TODO: implement socket service mock
    public basePath = 'some-service';
    public endpoints = {
        'some-url/:id': {
            handler: (
                request: Request,
                response: Response,
                next: NextFunction,
                endUrl: string,
                urlParams: { [paramName: string]: any }
            ) => {
                response.status(200)
                        .send({
                            handler: 'some-url',
                            endUrl: endUrl,
                            urlParams: urlParams
                        });
            },
            methods: [RequestMethods.GET]
        },
        'another-url/:id': {
            handler: (
                request: Request,
                response: Response,
                next: NextFunction,
                endUrl: string,
                urlParams: { [paramName: string]: any }
            ) => {
                response.status(200)
                        .send({
                            handler: 'another-url',
                            endUrl: endUrl,
                            urlParams: urlParams
                        });
            },
            methods: [RequestMethods.GET]
        },
        'yet-another-url/:id': {
            handler: (
                request: Request,
                response: Response,
                next: NextFunction,
                endUrl: string,
                urlParams: { [paramName: string]: any }
            ) => {
                response.status(200)
                        .send({
                            handler: 'yet-another-url',
                            endUrl: endUrl,
                            urlParams: urlParams
                        });
            },
            methods: [RequestMethods.GET]
        }
    };
}
