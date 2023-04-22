import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {RouterModule} from "@angular/router";
import {USER_ROUTE} from "./user.route";


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([USER_ROUTE])
  ]
})
export class UserModule {
}
