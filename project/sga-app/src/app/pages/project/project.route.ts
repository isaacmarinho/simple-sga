import { Route } from '@angular/router';
import {ProjectComponent} from "./project.component";

export const PROJECT_ROUTE: Route = {
    path: 'project',
    component: ProjectComponent,
    data: {
        authorities: [],
        pageTitle: 'project.title'
    }
};
