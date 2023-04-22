import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProjectComponent} from './project.component';
import {RouterModule} from "@angular/router";
import {PROJECT_ROUTE} from "./project.route";


@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([PROJECT_ROUTE])]
})
export class ProjectModule {
}
