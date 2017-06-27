import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { TypeOfInspection } from './typeofinspection';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TypeOfInspectionService {
  headers = new Headers();

  constructor(
    private http: Http,
    private userService: UserService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  createTypeOfInspection(data: TypeOfInspection) {
    data.userIdRegistered = this.userService.getuserid();
    return this.http
      .post(environment.serviceUrl + 'api/v1/typeofinspection', data)
      .map((res: Response) => res.json());
  }

  updateStatusTypeOfInspection(id: number): Promise<TypeOfInspection> {
    return this.http.put(`http://apiobras/api/v1/typeofinspection/status/${id}`, { id: id }, { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  updateTypeOfInspection(data: TypeOfInspection): Promise<TypeOfInspection> {
    return this.http.put(`http://apiobras/api/v1/typeofinspection/${data.id}`,
      JSON.stringify(data), { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  getAllTypeOfInspection() {
    return this.http
      .get(environment.serviceUrl + 'api/v1/typeofinspection')
      .map((res: Response) => res.json());
  }

  getTypeOfInspection(id: string): Promise<TypeOfInspection> {
    return this.http.get(`http://apiobras/api/v1/typeofinspection/${id}`)
      .toPromise()
      .then(res => res.json());
  }

  deleteTypeOfInspection(data: number) {
    return this.http
      .delete(environment.serviceUrl + 'api/v1/typeofinspection/' + data)
      .map((res: Response) => res.json());
  }
}
