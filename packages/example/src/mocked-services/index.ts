export * from './some-service/index';
import {BaseRequestHandler, StoreModule} from '@politician/server';
import {SomeService} from './some-service';

/**
 * List of available services
 * @type {{SomeService: SomeService}}
 */
const availableServices: StoreModule<new (store: StoreModule<any>) => BaseRequestHandler> = new StoreModule({
    PollService: SomeService
});

export {availableServices};
