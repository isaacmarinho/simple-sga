import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrganizationComponent} from './organization.component';
import {RouterModule} from "@angular/router";
import {ORGANIZATION_ROUTE} from "./organization.route";


@NgModule({
  declarations: [
    OrganizationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([ORGANIZATION_ROUTE])
  ]
})
export class OrganizationModule {
}
