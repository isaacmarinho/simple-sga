import {Injectable} from '@angular/core';
import {AmplifyService} from "./amplify.service";
import {Result} from "../../../../shared/interfaces/Result";
import {Observable} from "rxjs";
import {Process} from "../../../../shared/interfaces/Process";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalService {

  constructor(private amplifyService: AmplifyService) {

  }

  fetchProcess(pageNumber: number, itemsPerPage: number): Promise<Observable<Result> | Observable<Object>> {
    return this.amplifyService.apiGet(pageNumber, itemsPerPage);
  }

  createProcess(process: Process) {
    return this.amplifyService.apiInsert(process);
  }

  updateProcess(id: string, process: Partial<Process>) {
    return this.amplifyService.apiUpdate(id, process);
  }

  deleteProcess(id: string) {
    return this.amplifyService.apiDelete(id);
  }
}
