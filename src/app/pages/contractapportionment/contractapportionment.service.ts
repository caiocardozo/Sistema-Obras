import { UserService } from './../shared/user/user.service';
import { TypeOfContract } from './../typeofcontract/typeofcontract';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { ServiceBase } from "./../shared/service-base";

import { ContractApportionment } from './contractapportionment';

@Injectable()
export class ContractApportionmentService extends ServiceBase {


constructor(
        private http: Http,
        private userService: UserService) { super() }

registerContractA(contractApportionment: ContractApportionment): Observable<ContractApportionment> {
        //let options = super.obterAuthHeader();
        contractApportionment.userIdRegistered = this.userService.getuserid();
        contractApportionment.constructionId =  this.getIdConstructionWeb();
        contractApportionment.typeOfContractId =  this.getContractTypeWeb();
         contractApportionment.contractId =  this.getContractWeb();
        let response = this.http
            .post(environment.serviceUrl + 'api/v1/contractapp', contractApportionment)
            .map(super.extractData)
            .catch(super.serviceError);
        return response;
    }

    registerContractANew(contractApportionment: ContractApportionment): Observable<ContractApportionment> {
        //let options = super.obterAuthHeader();
        contractApportionment.userIdRegistered = this.userService.getuserid();
        let response = this.http
            .post(environment.serviceUrl + 'api/v1/contractapp', contractApportionment)
            .map(super.extractData)
            .catch(super.serviceError);
        return response;
    }
}
