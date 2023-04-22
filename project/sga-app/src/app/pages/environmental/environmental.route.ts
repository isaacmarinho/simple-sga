import {Route} from '@angular/router';
import {EnvironmentalComponent} from "./environmental.component";

export const ENVIRONMENTAL_ROUTE: Route = {
  path: 'environmental',
  component: EnvironmentalComponent,
  data: {
    authorities: [],
    pageTitle: 'environmental.title'
  }
};
