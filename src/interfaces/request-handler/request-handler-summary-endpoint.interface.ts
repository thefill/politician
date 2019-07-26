import {RequestMethods} from '../../enums';

export interface IRequestHandlerSummaryEndpoint {
    url: string;
    methods: RequestMethods[];
}
