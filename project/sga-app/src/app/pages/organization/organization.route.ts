import {Route} from '@angular/router';
import {OrganizationComponent} from "./organization.component";

export const ORGANIZATION_ROUTE: Route = {
  path: 'organization',
  component: OrganizationComponent,
  data: {
    authorities: [],
    pageTitle: 'organization.title'
  }
};
