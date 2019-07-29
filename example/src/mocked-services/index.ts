export * from './some-service';
import {BaseRequestHandler} from '../../../src/classes/base-request-handler';
import {StoreService} from '../../../src/services/store';
import {SomeService} from './some-service';

// TODO: move to cli bin
/**
 * List of available services
 * @type {{SomeService: SomeService}}
 */
const availableServices: StoreService<new (store: StoreService<any>) => BaseRequestHandler> = new StoreService({
    PollService: SomeService
});

export {availableServices};
