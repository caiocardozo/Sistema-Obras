import { UserService } from './../shared/user/user.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { ServiceBase } from "./../shared/service-base";

import { BiddingApportionment } from './biddingapportionment';

@Injectable()
export class BiddingApportionmentService extends ServiceBase {

  static emitirBiddingApportionmentCreate = new EventEmitter<boolean>();
  constructor(
    private http: Http,
    private userService: UserService) { super() }


  getAllBiddingsAConstruction(idbidding: number) {
    let response = this.http
      .get(environment.serviceUrl + `api/v1/biddingappconstruction/${idbidding}`)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  registerBiddingA(biddingApportionment: BiddingApportionment): Observable<BiddingApportionment> {
    //let options = super.obterAuthHeader();
    biddingApportionment.userIdRegistered = this.userService.getuserid();
    biddingApportionment.constructionId = this.getIdConstructionWeb();
    biddingApportionment.biddingId = this.getBiddingWeb();
    biddingApportionment.biddingShoppingPortalId = this.getBiddingShopWeb();
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/biddingapp', biddingApportionment)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  registerBiddingA2(biddingApportionment: BiddingApportionment): Observable<BiddingApportionment> {
    //let options = super.obterAuthHeader();
    biddingApportionment.userIdRegistered = this.userService.getuserid();
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/biddingapp', biddingApportionment)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }
}
