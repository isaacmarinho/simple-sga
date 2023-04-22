import {Injectable} from '@angular/core';
import {AmplifyService} from "./amplify.service";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalService {

  constructor(private amplifyService: AmplifyService) {


    amplifyService.apiGet().then(value => value.subscribe((x) => console.log(x)));
  }
}
