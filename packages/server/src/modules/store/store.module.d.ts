export declare class StoreModule<T> {
    protected store: {
        [key: string]: T;
    };
    constructor(initialValues: {
        [key: string]: T;
    });
    get(key: string | number): T;
    getMultiple(keys: Array<string | number>): T[];
    set(key: string | number, value: T): void;
    setMultiple(entries: {
        key: string | number;
        value: T;
    }[]): void;
    delete(key: string | number): void;
    deleteMultiple(keys: Array<string | number>): void;
    keys(): string[];
    length(): number;
}
