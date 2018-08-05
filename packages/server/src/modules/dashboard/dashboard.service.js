"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_request_handler_1 = require("../base-request-handler");
class DashboardService extends base_request_handler_1.BaseRequestHandler {
    constructor() {
        super(...arguments);
        this.basePath = 'dashboard';
        this.endpoints = {
            '/': {
                handler: (request, response, next, endUrl, urlParams) => {
                    response.status(200)
                        .send({
                        handler: 'dashboard root',
                        endUrl: endUrl,
                        urlParams: urlParams
                    });
                },
                methods: [base_request_handler_1.RequestMethods.GET]
            },
            'action/:id': {
                handler: (request, response, next, endUrl, urlParams) => {
                    response.status(200)
                        .send({
                        handler: 'mobility-tasks',
                        endUrl: endUrl,
                        urlParams: urlParams
                    });
                },
                methods: [base_request_handler_1.RequestMethods.GET]
            }
        };
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map