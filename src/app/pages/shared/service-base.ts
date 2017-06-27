import { Construction } from './../construction/construction';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';

import { LocalBd } from './localBd';

export abstract class ServiceBase {
  public Token: string = "";

  constructor() {
    this.Token = localStorage.getItem('pof.token');
  }

  protected obterAuthHeader(): RequestOptions {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', `Bearer ${this.Token}`);
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  protected extractData(response: Response) {
    let body = response.json();
    return body || {};
  }

  protected serviceError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(error);
    return Observable.throw(error);
  }

  public setConstructionWeb(construction: Construction): boolean {
    localStorage.setItem('pof.idConstruction', JSON.stringify(construction.id));
    localStorage.setItem('pof.descriptionConstruction', construction.description);
    return true;
  }

  public getConstructionWeb(): LocalBd {
    let localBd = new LocalBd(localStorage.getItem('pof.idConstruction'), localStorage.getItem('pof.descriptionConstruction'));
    return localBd;
  }

  public setBiddingAndShopWeb(idBidding: number, idBiddingShopId: number) {
    localStorage.setItem('pof.idBiddingShop', JSON.stringify(idBiddingShopId));
    localStorage.setItem('pof.idBidding', JSON.stringify(idBidding));
  }

  public setBiddingWeb(idBidding: number) {
    localStorage.setItem('pof.idBidding', JSON.stringify(idBidding));
  }
  public getBiddingWeb(): number {
    let idBidding = +localStorage.getItem('pof.idBidding');
    return idBidding;
  }
  public getBiddingShopWeb(): number {
    let idBiddingShop = +localStorage.getItem('pof.idBiddingShop');
    return idBiddingShop;
  }
  public getIdConstructionWeb(): number {
    let idConstruction = +localStorage.getItem('pof.idConstruction');
    return idConstruction;
  }

  public setContractAndTypeWeb(idContract: number, idContractType: number) {
    localStorage.setItem('pof.idContract', JSON.stringify(idContract));
    localStorage.setItem('pof.idContractType', JSON.stringify(idContractType));
  }

  public setContractWeb(idContract: number) {
    localStorage.setItem('pof.idContract', JSON.stringify(idContract));
  }

  public getContractWeb(): number {
    let idContract = +localStorage.getItem('pof.idContract');
    return idContract;
  }

  public getContractTypeWeb(): number {
    let idContractType = +localStorage.getItem('pof.idContractType');
    return idContractType;
  }

  public setApportionmentCodeWeb(rateio: number): boolean {
    localStorage.setItem('pof.idRateio', JSON.stringify(rateio));
    return true;
  }

  public getApportionmentCodeWeb(): number {
    let rateio = (localStorage.getItem('pof.idRateio'));
    return +rateio;
  }
}
