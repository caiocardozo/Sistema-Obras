import { ServiceBase } from './../shared/service-base';
import { UserService } from './../shared/user/user.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { Contract } from './contract';


@Injectable()
export class ContractService extends ServiceBase {

  static teste = new EventEmitter<number>();

  headers = new Headers();
  constructor(
    private http: Http,
    private userService: UserService) {
    super();
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  getAllContracts() {
    return this.http
      .get(environment.serviceUrl + `api/v1/contract`)
      .map((res: Response) => res.json());
  }

  getAllContractsConstruction() {
    let id: number = this.getIdConstructionWeb();

    let response = this.http
      .get(environment.serviceUrl + `api/v1/contractconstruction/${id}`)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  registerContract(contract: Contract): Observable<Contract> {
    //let options = super.obterAuthHeader();
    contract.userIdRegistered = this.userService.getuserid();
    contract.constructionId = this.getIdConstructionWeb();
    contract.biddingId = this.getBiddingWeb();
    contract.signatureDate = contract.signatureDate["formatted"];
    contract.contractDuration = contract.contractDuration["formatted"];
    if (contract.typeOfContractId == 1)
      contract.contractOrigin = 0;
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/contract', contract)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  registerContractSupression(contract: Contract): Observable<Contract> {
    //let options = super.obterAuthHeader();
    contract.userIdRegistered = this.userService.getuserid();
    contract.constructionId = this.getIdConstructionWeb();
    // contract.biddingId = this.getBiddingWeb();
    contract.signatureDate = contract.signatureDate["formatted"];
    contract.contractDuration = contract.contractDuration["formatted"];
    contract.typeOfContractId = 6;
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/contract', contract)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  getContract(id: number): Promise<Contract> {
    return this.http.get(environment.serviceUrl + `api/v1/contract/${id}`)
      .toPromise()
      .then(res => res.json());
  }

  ContratoPram(contrato: number) {
    ContractService.teste.emit(contrato);
  }

  getContractsConstructionBidding(constructionId: number, biddingId: number) {
    let id: number = this.getIdConstructionWeb();
    let response = this.http
      .get(environment.serviceUrl + `api/v1/contractcb/${constructionId}/${biddingId}`)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

  newRegisterContract(contract: Contract): Observable<Contract> {
    //let options = super.obterAuthHeader();
    contract.userIdRegistered = this.userService.getuserid();
    contract.signatureDate = contract.signatureDate["formatted"];
    contract.contractDuration = contract.contractDuration["formatted"];
    if (contract.typeOfContractId == 1)
      contract.contractOrigin = 0;
    let response = this.http
      .post(environment.serviceUrl + 'api/v1/contract', contract)
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }

}
