import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AmplifyService} from "../../services/amplify.service";
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authenticator: AuthenticatorService) { }

  ngOnInit(): void {
    if(this.authenticator.route !== "authenticated"){
      this.router.navigateByUrl("/login").then(r => console.log("Navigate to login"));
    }
  }

}
