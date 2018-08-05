/**
 * Generic store of data
 */
export class StoreModule<T> {
    protected store: { [key: string]: T } = {};

    constructor(initialValues: { [key: string]: T }) {
        Object.assign(
            this.store,
            initialValues
        );
    }

    /**
     * Get single value
     * @param {string | number} key
     * @returns {T}
     */
    public get(key: string | number): T {
        // if single value
        return this.store[key];
    }

    /**
     * Get multiple values
     * @param {Array<string | number>} keys
     * @returns {T[]}
     */
    public getMultiple(keys: Array<string | number>): T[] {
        // if multiple values
        return keys.map((innerKey) => {
            return this.get(innerKey);
        });
    }

    /**
     * Get set single value
     * @param {string | number} key
     * @param {T} value
     * @returns {{[p: string]: T}[string | number]}
     */
    public set(
        key: string | number,
        value: T
    ): void {
        this.store[key] = value;
    }

    /**
     * Set multiple values
     * @param {{key: string | number; value: T}} entries
     */
    public setMultiple(entries: { key: string | number, value: T }[]): void {
        // if multiple values
        entries.forEach((entry) => {
            this.set(
                entry.key,
                entry.value
            );
        });
    }

    /**
     * Delete single value
     * @param {string | number} key
     */
    public delete(key: string | number): void {
        // if single value
        delete this.store[key];
    }

    /**
     * Get multiple values
     * @param {Array<string | number>} keys
     * @returns {T[]}
     */
    public deleteMultiple(keys: Array<string | number>): void {
        // if multiple values
        keys.forEach((key) => {
            this.delete(key);
        });
    }

    /**
     * Get store keys
     * @returns {string[]}
     */
    public keys(): string[] {
        return Object.keys(this.store);
    }

    /**
     * Get store item count
     * @returns {number}
     */
    public length(): number {
        return this.keys().length;
    }
}
