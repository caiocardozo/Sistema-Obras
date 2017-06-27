import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../../environments/environment';
import { Campus } from './campus';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CampusService {
  headers = new Headers();
  constructor(
    private http: Http,
    private userService: UserService) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  getAllCampus() {
    return this.http
      .get(environment.serviceUrl + `api/v1/campi`)
      .map((res: Response) => res.json());
  }
}
