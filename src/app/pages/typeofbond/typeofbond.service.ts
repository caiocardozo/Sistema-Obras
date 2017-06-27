import { ServiceBase } from 'app/pages/shared/service-base';
import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { TypeOfBond } from './typeofbond';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TypeOfBondService extends ServiceBase{
  headers = new Headers();

  constructor(private http: Http, private userService: UserService) {
    super()
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  createTypeOfBond(data: TypeOfBond) {
    data.userIdRegistered = this.userService.getuserid();
    return this.http
      .post(environment.serviceUrl + `api/v1/typeofbond`, data)
      .map((res: Response) => res.json());
  }

  updateStatusTypeOfBond(id: number): Promise<TypeOfBond> {
    return this.http.put(environment.serviceUrl + `api/v1/typeofbond/status/${id}`, { id: id }, { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  getAllTypeOfBond() {
    return this.http
      .get(environment.serviceUrl + `api/v1/typeofbond`)
      .map((res: Response) => res.json());
  }

  getTypeOfBond(id: string): Promise<TypeOfBond> {
    return this.http.get(environment.serviceUrl + `api/v1/typeofbond/${id}`)
      .toPromise()
      .then(res => res.json());
  }

  deleteTypeOfBond(data: number) {
    return this.http
      .delete(environment.serviceUrl + 'api/v1/typeofbond/' + data)
      .map((res: Response) => res.json());
  }

 updateTypeOfBond(data: TypeOfBond): Observable<TypeOfBond> {
    let response = this.http
      .put(environment.serviceUrl + `api/v1/typeofbond/${data.id}`,
      JSON.stringify(data), { headers: this.headers })
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }
}
