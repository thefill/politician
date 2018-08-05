"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRequestHandler {
    constructor(store) {
        this.store = store;
    }
    getSummary() {
        return {
            basePath: this.basePath,
            endpoints: Object.keys(this.endpoints)
        };
    }
}
exports.BaseRequestHandler = BaseRequestHandler;
//# sourceMappingURL=base-request-handler.class.js.map