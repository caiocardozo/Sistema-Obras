import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { Construction } from './construction';
import { ServiceBase } from "./../shared/service-base";


@Injectable()
export class ConstructionService extends ServiceBase {
    constructor(
        private http: Http,
        private userService: UserService) { super() }



    registerConstruction(construction: Construction): Observable<Construction> {
        //let options = super.obterAuthHeader();
        construction.userIdRegistered = this.userService.getuserid();
        construction.startDate = construction.startDate["formatted"];
        construction.endDate = construction.endDate["formatted"];
        construction.contractTerminationDate = construction.contractTerminationDate["formatted"];
        let response = this.http
            .post(environment.serviceUrl + `api/v1/construction`, construction)
            .map(super.extractData)
            .catch(super.serviceError);
        return response;
    }

    getAllConstruction() {
        return this.http
            .get(environment.serviceUrl + `api/v1/construction`)
            .map((res: Response) => res.json());
    }

    getAllConstructionHome() {
        return this.http
            .get(environment.serviceUrl + `api/v1/constructionhome`)
            .map((res: Response) => res.json());
    }

    getConstruction(id: string): Observable<Construction> {
        let response = this.http
            .get(environment.serviceUrl + `api/v1/construction/${id}`)
            .map(super.extractData)
            .catch(super.serviceError);

        return response;
    }
}

