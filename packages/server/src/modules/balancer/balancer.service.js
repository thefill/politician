"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoutePattern = require("route-pattern");
const base_request_handler_1 = require("../base-request-handler");
class BalancerService {
    constructor(baseUrl, services) {
        this.baseUrl = baseUrl;
        this.serviceStore = services;
    }
    route(request, response, next) {
        const method = base_request_handler_1.RequestMethods[request.method];
        const url = request.url.substr(this.baseUrl.length + 2);
        const endpointConfig = this.findEndpoint(method, url);
        if (endpointConfig && endpointConfig.endpoint) {
            endpointConfig.endpoint.handler(request, response, next, endpointConfig.endUrl, endpointConfig.urlParams);
        }
        else {
            next();
        }
    }
    getAvailableMocks() {
        return this.serviceStore.keys()
            .map((key) => {
            const summary = this.serviceStore.get(key)
                .getSummary();
            return {
                basePath: summary.basePath,
                endpoints: summary.endpoints
            };
        });
    }
    findEndpoint(method, url) {
        const urlPartials = url.split('/');
        const serviceKey = this.serviceStore.keys()
            .find((key) => {
            return this.serviceStore.get(key).basePath === urlPartials[0];
        });
        if (!serviceKey) {
            return;
        }
        const service = this.serviceStore.get(serviceKey);
        urlPartials.shift();
        const requestUrl = urlPartials.join('/');
        const extractedUrlParams = {};
        const endpointKey = Object.keys(service.endpoints)
            .find((route) => {
            const routePattern = RoutePattern.fromString(route);
            const match = routePattern.match(requestUrl);
            if (match) {
                Object.assign(extractedUrlParams, match.namedParams);
                return true;
            }
            else {
                return false;
            }
        });
        if (!endpointKey) {
            return;
        }
        const endpoint = service.endpoints[endpointKey];
        return {
            endpoint,
            endUrl: requestUrl.substr(endpointKey.length),
            urlParams: extractedUrlParams
        };
    }
}
exports.BalancerService = BalancerService;
//# sourceMappingURL=balancer.service.js.map