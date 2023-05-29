import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  constructor(private router: Router, private authenticator: AuthenticatorService) { }

  ngOnInit(): void {
    if(this.authenticator.route !== "authenticated"){
      this.router.navigateByUrl("/login").then(r => console.log("Navigate to login"));
    }
  }
}
