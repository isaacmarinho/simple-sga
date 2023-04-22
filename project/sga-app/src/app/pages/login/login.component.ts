import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authenticator: AuthenticatorService) {
  }

  ngOnInit(): void {
    this.authenticator.subscribe(() => {
      const { route } = this.authenticator;
      if (route === 'authenticated') {
        this.router.navigateByUrl("/home").then(r => console.log("Navigate to home"));
      }
    });
  }
}
