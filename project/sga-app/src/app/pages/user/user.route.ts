import {Route} from '@angular/router';
import {UserComponent} from "./user.component";

export const USER_ROUTE: Route = {
  path: 'user',
  component: UserComponent,
  data: {
    authorities: [],
    pageTitle: 'user.title'
  }
};
