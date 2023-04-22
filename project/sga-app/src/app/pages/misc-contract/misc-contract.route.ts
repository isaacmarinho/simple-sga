import {Route} from '@angular/router';
import {MiscContractComponent} from "./misc-contract.component";

export const MISC_CONTRACT_ROUTE: Route = {
  path: 'misc-contract',
  component: MiscContractComponent,
  data: {
    authorities: [],
    pageTitle: 'misc-contract.title'
  }
};
