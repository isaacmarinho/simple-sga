import {Injectable} from '@angular/core';
import {AmplifyService} from "./amplify.service";
import {Result} from "../../../../shared/interfaces/Result";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalService {

  constructor(private amplifyService: AmplifyService) {

  }

  fetchProcess(pageNumber: number, itemsPerPage: number): Promise<Observable<Result> | Observable<Object>> {
    return this.amplifyService.apiGet(pageNumber, itemsPerPage);
  }
}
