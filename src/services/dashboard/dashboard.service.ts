import {IInjection} from 'jetli';

// TODO: server should serve app on /dashboard/ that allows:
// - disabling service mocks
// - changing served data per endpoint
// - changing response code per endpoint
export class DashboardService implements IInjection {
    public static basePath = 'dashboard';
    public initialised = false;

    public async init(): Promise<void> {
        this.initialised = true;
    }
}
