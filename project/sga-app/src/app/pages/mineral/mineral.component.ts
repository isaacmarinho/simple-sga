import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";

@Component({
  selector: 'app-mineral',
  templateUrl: './mineral.component.html',
  styleUrls: ['./mineral.component.sass']
})
export class MineralComponent implements OnInit {

  constructor(private router: Router, private authenticator: AuthenticatorService) { }

  ngOnInit(): void {
    if(this.authenticator.route !== "authenticated"){
      this.router.navigateByUrl("/login").then(r => console.log("Navigate to login"));
    }
  }

}
