import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { TypeOfContract } from './typeofcontract';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ServiceBase } from "./../shared/service-base";
import { UserService } from './../shared/user/user.service';

@Injectable()
export class TypeOfContractService extends ServiceBase {
    headers = new Headers();

    constructor(private http: Http, private userService: UserService)
    {
      super()
      this.headers = new Headers({ 'Content-Type': 'application/json' });
    }

    createTypeOfContract(data: TypeOfContract) {
        data.userIdRegistered = this.userService.getuserid();
        return this.http
            .post(environment.serviceUrl + 'api/v1/typeofcontract', data)
            .map((res: Response) => res.json());
    }

    updateStatusTypeOfContract(id: number): Promise<TypeOfContract> {
        return this.http.put(environment.serviceUrl + `api/v1/typeofcontract/status/${id}`, { id: id }, { headers: this.headers })
            .toPromise().then(res => res.json());
    }

    updateISapiensTypeOfContract(id: number): Promise<TypeOfContract> {
        return this.http.put(environment.serviceUrl + `api/v1/typeofcontract/integratedsapiens/${id}`, { id: id }, { headers: this.headers })
            .toPromise().then(res => res.json());
    }

    getAllTypeOfContract() {
        return this.http
            .get(environment.serviceUrl + 'api/v1/typeofcontract')
            .map((res: Response) => res.json());
    }

    getTypeOfContract(id: string): Promise<TypeOfContract> {
        return this.http.get(environment.serviceUrl + `api/v1/typeofcontract/${id}`)
            .toPromise()
            .then(res => res.json());
    }

    deleteTypeOfContract(data: number) {
        return this.http
            .delete(environment.serviceUrl + 'api/v1/typeofcontract/' + data)
            .map((res: Response) => res.json());
    }

    updateTypeOfContract(data: TypeOfContract): Observable<TypeOfContract> {
    let response = this.http
      .put(environment.serviceUrl + `api/v1/typeofcontract/${data.id}`,
       JSON.stringify(data), { headers: this.headers })
      .map(super.extractData)
      .catch(super.serviceError);
    return response;
  }
}
