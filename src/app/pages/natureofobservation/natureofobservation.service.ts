import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { ServiceBase } from './../shared/service-base';
import { NatureOfObservation } from './natureofobservation';
import { UserService } from './../shared/user/user.service';
@Injectable()
export class NatureOfObservationService extends ServiceBase {
  headers = new Headers();

  constructor(private http: Http,
    private userService: UserService) {
    super()
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  createNatureOfObservation(data: NatureOfObservation) {
    data.userIdRegistered = this.userService.getuserid();
    return this.http
      .post(environment.serviceUrl + 'api/v1/natureofobservation', data)
      .map((res: Response) => res.json());
  }

  updateStatusNatureOfObservation(id: number): Promise<NatureOfObservation> {
    return this.http.put(environment.serviceUrl + `api/v1/natureofobservation/status/${id}`, { id: id }, { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  updateIAvailableNatureOfObservation(id: number): Promise<NatureOfObservation> {
    return this.http.put(environment.serviceUrl + `api/v1/natureofobservation/internallyavailable/${id}`, { id: id }, { headers: this.headers })
      .toPromise().then(res => res.json());
  }

  getAllNatureOfObservation() {
    return this.http
      .get(environment.serviceUrl + 'api/v1/natureofobservation')
      .map((res: Response) => res.json());
  }

  getNatureOfObservation(id: string): Promise<NatureOfObservation> {
    return this.http.get(environment.serviceUrl + `api/v1/natureofobservation/${id}`)
      .toPromise()
      .then(res => res.json());
  }

  deleteNatureOfObservation(data: number) {
    return this.http
      .delete(environment.serviceUrl + 'api/v1/natureofobservation/' + data)
      .map((res: Response) => res.json());
  }

  updateNatureOfObservation(data: NatureOfObservation): Observable<NatureOfObservation> {
    let response = this.http
      .put(environment.serviceUrl + `api/v1/natureofobservation/${data.id}`,
      JSON.stringify(data), { headers: this.headers })
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }
}
