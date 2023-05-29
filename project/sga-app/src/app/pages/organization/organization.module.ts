import {NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrganizationComponent} from './organization.component';
import {Router, RouterModule} from "@angular/router";
import {ORGANIZATION_ROUTE} from "./organization.route";
import {AuthenticatorService} from "@aws-amplify/ui-angular";


@NgModule({
  declarations: [
    OrganizationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([ORGANIZATION_ROUTE])
  ]
})
export class OrganizationModule implements OnInit {

  constructor(private router: Router, private authenticator: AuthenticatorService) { }

  ngOnInit(): void {
    if(this.authenticator.route !== "authenticated"){
      this.router.navigateByUrl("/login").then(r => console.log("Navigate to login"));
    }
  }
}
