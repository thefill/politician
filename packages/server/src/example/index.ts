import {AppModule} from '../';
import {availableServices} from './mocked-services';

// Create new app with server spawning automatically
// and pass object containing service objects that should be mocked
const app = new AppModule(availableServices);
