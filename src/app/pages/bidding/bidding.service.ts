import { UserService } from './../shared/user/user.service';
import { ServiceBase } from './../shared/service-base';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { Bidding } from './bidding';


@Injectable()
export class BiddingService extends ServiceBase {

  static emitirBiddingCreate = new EventEmitter<boolean>();

  constructor(
    private http: Http,
    private userService: UserService) { super() }


  getAllBiddingsConstruction() {
    let id: number = this.getIdConstructionWeb();
    let response = this.http
      .get(environment.serviceUrl + `api/v1/biddingconstruction/${id}`)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  registerBidding(bidding: Bidding): Observable<Bidding> {
    //let options = super.obterAuthHeader();
    bidding.userIdRegistered = this.userService.getuserid();
    bidding.constructionId = this.getIdConstructionWeb();
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/bidding', bidding)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  updateBiddingFront(atualizar: boolean) {
    BiddingService.emitirBiddingCreate.emit(atualizar);
  }

  getBidding(id: number): Observable<Bidding> {
    return this.http
      .get(environment.serviceUrl + `api/v1/bidding/${id}`)
      .map((res: Response) => <Bidding[]>res.json())
      .catch(super.serviceError);
  }
}
