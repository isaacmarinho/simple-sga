import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import Amplify, {API, Auth} from 'aws-amplify';

import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Result} from "../../../../shared/interfaces/Result";
import {Process} from "../../../../shared/interfaces/Process";

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AmplifyService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient) {
    Amplify.configure({
      Auth: environment.cognito,
      API: environment.api
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password)
      .then(() => {
        this.authenticationSubject.next(true);
      });
  }

  public signOut(): Promise<any> {
    return Auth.signOut()
      .then(() => {
        this.authenticationSubject.next(false);
      });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          if (user) {
            return true;
          } else {
            return false;
          }
        }).catch(() => {
          return false;
        });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
      .then((cognitoUser: any) => {
        return Auth.updateUserAttributes(cognitoUser, user);
      });
  }

  public async getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`
      })
    };
  }

  public async apiInsert(process: Process) {
    return await API.endpoint("simple-sga-api").then((value) => {
      return this.getHeaders().then(headers => {
        return this.httpClient.post(`${value}/environmental/process/add`, process, headers);
      })
    })
  }

  public async apiUpdate(process: Process) {
    return await API.endpoint("simple-sga-api").then((value) => {
      return this.getHeaders().then(headers => {
        return this.httpClient.patch(`${value}/environmental/process/update`, process, headers);
      })
    })
  }

  public async apiGet(page: number, maxItems: number): Promise<Observable<Result> | Observable<Object>> {
    return await API.endpoint("simple-sga-api").then((value) => {
      return this.getHeaders().then(headers => {
        return this.httpClient.get(`${value}/environmental/process/?pageNumber=${page}&limit=${maxItems}`, headers);
      })
    })
  }

  public async apiDelete(id: string) {
    return await API.endpoint("simple-sga-api").then((value) => {
      return this.getHeaders().then(headers => {
        return this.httpClient.delete(`${value}/environmental/process/remove/${id}`, headers);
      })
    })
  }
}
