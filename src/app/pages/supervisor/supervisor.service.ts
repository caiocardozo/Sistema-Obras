import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { Measurement } from './../measurement/measurement';

@Injectable()
export class SupervisorService {

  headers = new Headers();
  constructor(
    private http: Http,
    private userService: UserService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  getSupervisors() {
    return this.http
      .get(environment.serviceUrl + `api/v1/supervisor`)
      .map((res: Response) => res.json());
  }
}
