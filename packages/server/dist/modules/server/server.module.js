"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const Server = require("express");
const os = require("os");
class ServerModule {
    constructor(port, urlBase, balancer) {
        this.port = port;
        this.urlBase = urlBase;
        this.balancer = balancer;
        this.ip = this.getIp();
        this.server = Server();
    }
    init() {
        return new Promise((resolve) => {
            this.setupServer(resolve);
        });
    }
    getIp() {
        var networkInterfaces = os.networkInterfaces();
        const ips = [];
        Object.keys(networkInterfaces)
            .forEach(function (name) {
            networkInterfaces[name].forEach(function (networkInterface) {
                if ('IPv4' !== networkInterface.family || networkInterface.internal !== false) {
                    return;
                }
                ips.push(networkInterface.address);
            });
        });
        return ips[ips.length - 1];
    }
    setupServer(resolve) {
        this.server.use(bodyParser.json());
        this.server.use(cors());
        this.server.all(`/${this.urlBase}/*`, this.handleAll.bind(this));
        this.server.use(this.errorHandler.bind(this));
        this.server.use(this.notFoundHandler.bind(this));
        this.server.listen(this.port, () => {
            resolve();
        });
    }
    notFoundHandler(request, response, next) {
        response.status(404)
            .send();
        response.end();
    }
    errorHandler(error, request, response, next) {
        response.status(500)
            .send();
        response.end();
    }
    handleAll(request, response, next) {
        this.balancer.route(request, response, next);
    }
}
exports.ServerModule = ServerModule;
//# sourceMappingURL=server.module.js.map