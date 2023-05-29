import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-misc-contract',
  templateUrl: './misc-contract.component.html',
  styleUrls: ['./misc-contract.component.sass']
})
export class MiscContractComponent implements OnInit {

  constructor(private router: Router, private authenticator: AuthenticatorService) { }

  ngOnInit(): void {
    if(this.authenticator.route !== "authenticated"){
      this.router.navigateByUrl("/login").then(r => console.log("Navigate to login"));
    }
  }

}
