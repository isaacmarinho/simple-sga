import {Route} from '@angular/router';
import {MineralComponent} from "./mineral.component";

export const MINERAL_ROUTE: Route = {
  path: 'mineral',
  component: MineralComponent,
  data: {
    authorities: [],
    pageTitle: 'mineral.title'
  }
};
