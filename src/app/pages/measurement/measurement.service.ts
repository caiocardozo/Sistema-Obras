import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { Measurement } from './measurement';
import { ServiceBase } from "./../shared/service-base";

@Injectable()
export class MeasurementService extends ServiceBase {

  constructor(
    private http: Http,
    private userService: UserService) { super() }

  registerMeasurement(measurement: Measurement): Observable<Measurement> {
    //let options = super.obterAuthHeader();
    measurement.userIdRegistered = this.userService.getuserid();
    measurement.constructionId = this.getIdConstructionWeb();
    measurement.contractId = this.getContractWeb();
    measurement.apportionmentCode = this.getApportionmentCodeWeb();
    measurement.date = measurement.date["formatted"];
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/measurement', measurement)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  registerMeasurementN(measurement: Measurement): Observable<Measurement> {
    //let options = super.obterAuthHeader();
    measurement.userIdRegistered = this.userService.getuserid();
    measurement.date = measurement.date["formatted"];
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/measurement', measurement)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  getMeasurementsConstruction(): Observable<Measurement[]> {
    let id: number = this.getIdConstructionWeb();
    let response = this.http
      .get(environment.serviceUrl + `api/v1/measurementconstruction/${id}`)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  getMeasurementsAppCon(apportionmentId: number, contractId: number): Observable<Measurement[]> {
    let id: number = this.getIdConstructionWeb();
    let response = this.http
      .get(environment.serviceUrl + `api/v1/measurementsappcon/${apportionmentId}/${contractId}`)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }
}
