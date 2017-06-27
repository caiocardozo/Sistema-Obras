import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { ServiceBase } from './../shared/service-base';
import { UserService } from './../shared/user/user.service';
import { Situation } from './situation';

@Injectable()
export class SituationService extends ServiceBase {
  headers = new Headers();
  constructor(
    private http: Http,
    private userService: UserService) {
    super()
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  createSituation(data: Situation) {
    data.userIdRegistered = this.userService.getuserid();
    return this.http
      .post(environment.serviceUrl + 'api/v1/situation', data)
      .map((res: Response) => res.json());
  }

  updateStatusSituation(id: number): Promise<Situation> {
    return this.http.put(environment.serviceUrl + `api/v1/situation/status/${id}`,
      { id: id },
      { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  getAllSituation() {
    return this.http
      .get(environment.serviceUrl + `api/v1/situation`)
      .map((res: Response) => res.json());
  }


  getSituation(id: string): Promise<Situation> {
    return this.http.get(environment.serviceUrl + `api/v1/situation/${id}`)
      .toPromise()
      .then(res => res.json());
  }

  deleteSituation(data: number) {
    return this.http
      .delete(environment.serviceUrl + 'api/v1/situation/' + data)
      .map((res: Response) => res.json());
  }

  updateSituation(data: Situation): Observable<Situation> {
    let response = this.http
      .put(environment.serviceUrl + `api/v1/situation/${data.id}`,
      JSON.stringify(data), { headers: this.headers })
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }
}
