import {Politician} from '../../src';
import {availableServices} from './mocked-services';

// Create new app with server spawning automatically
// and pass object containing service objects that should be mocked
const app = new Politician({
    availableRequestServices: availableServices
});
app.init();
