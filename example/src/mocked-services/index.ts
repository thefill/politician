export * from './some-service';
import {BaseRequestHandler} from '../../../src/server/modules/base-request-handler';
import {StoreModule} from '../../../src/server/modules/store';
import {SomeService} from './some-service';

/**
 * List of available services
 * @type {{SomeService: SomeService}}
 */
const availableServices: StoreModule<new (store: StoreModule<any>) => BaseRequestHandler> = new StoreModule({
    PollService: SomeService
});

export {availableServices};
