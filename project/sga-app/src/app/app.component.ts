import {Component} from '@angular/core';
import {AuthenticatorService} from "@aws-amplify/ui-angular";
import {Amplify} from "aws-amplify";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'sga-app';

  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(environment.cognito);
  }
}
