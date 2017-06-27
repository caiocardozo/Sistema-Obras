import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { TypeOfConstruction } from './typeofconstruction';
import { UserService } from './../shared/user/user.service';
import { ServiceBase } from "./../shared/service-base";

@Injectable()
export class TypeOfConstructionService extends ServiceBase {
  headers = new Headers();

  constructor(private http: Http, private userService: UserService) {
    super()
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  createTypeOfConstruction(data: TypeOfConstruction) {
    data.userIdRegistered = this.userService.getuserid();
    return this.http
      .post(environment.serviceUrl + 'api/v1/typeofconstruction', data)
      .map((res: Response) => res.json());
  }

  updateStatusTypeOfConstruction(id: number): Promise<TypeOfConstruction> {
    return this.http.put(environment.serviceUrl + `api/v1/typeofconstruction/status/${id}`,
      { id: id }, { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  updateTypeOfConstruction(data: TypeOfConstruction): Observable<TypeOfConstruction> {
    let response = this.http
      .put(environment.serviceUrl + `api/v1/typeofconstruction/${data.id}`,
       JSON.stringify(data), { headers: this.headers })
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  getAllTypeOfConstruction() {
    return this.http
      .get(environment.serviceUrl + 'api/v1/typeofconstruction')
      .map((res: Response) => res.json());
  }

  getTypeOfConstruction(id: string): Promise<TypeOfConstruction> {
    return this.http.get(environment.serviceUrl + `api/v1/typeofconstruction/${id}`)
      .toPromise()
      .then(res => res.json());
  }

  deleteTypeOfBond(data: number) {
    return this.http
      .delete(environment.serviceUrl + 'api/v1/typeofconstruction/' + data)
      .map((res: Response) => res.json());
  }
}
