import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {LOGIN_ROUTE} from "./login.route";
import {LoginComponent} from "./login.component";
import {AmplifyAuthenticatorModule} from "@aws-amplify/ui-angular";
import {environment} from "../../../environments/environment";
import {Amplify} from "aws-amplify";

Amplify.configure(environment.cognito);

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([LOGIN_ROUTE]), AmplifyAuthenticatorModule
  ],
  exports: [LoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule {

}
