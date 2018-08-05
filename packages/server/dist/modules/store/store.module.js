"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StoreModule {
    constructor(initialValues) {
        this.store = {};
        Object.assign(this.store, initialValues);
    }
    get(key) {
        return this.store[key];
    }
    getMultiple(keys) {
        return keys.map((innerKey) => {
            return this.get(innerKey);
        });
    }
    set(key, value) {
        this.store[key] = value;
    }
    setMultiple(entries) {
        entries.forEach((entry) => {
            this.set(entry.key, entry.value);
        });
    }
    delete(key) {
        delete this.store[key];
    }
    deleteMultiple(keys) {
        keys.forEach((key) => {
            this.delete(key);
        });
    }
    keys() {
        return Object.keys(this.store);
    }
    length() {
        return this.keys().length;
    }
}
exports.StoreModule = StoreModule;
//# sourceMappingURL=store.module.js.map