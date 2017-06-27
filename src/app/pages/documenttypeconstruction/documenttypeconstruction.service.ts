import { UserService } from './../shared/user/user.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { DocumentTypeConstruction } from './documenttypeconstruction';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DocumentTypeConstructionService {

    headers = new Headers();
    constructor(
        private http: Http,
        private userService: UserService ) {
        this.headers = new Headers({'Content-Type': 'application/json'});
     }

    createDocumentTypeConstruction(data: DocumentTypeConstruction) {
        data.userIdRegistered = this.userService.getuserid();
        console.log(data);
        return this.http
            .post(environment.serviceUrl + 'api/v1/documenttypeconstruction', data)
            .map((res: Response) => res.json());
    }

    updateStatusDocumentTypeConstruction(id: number): Promise<DocumentTypeConstruction>{
        return this.http.put(environment.serviceUrl + `api/v1/documenttypeconstruction/status/${id}`, {id: id}, {headers: this.headers})
        .toPromise().then(res => res.json());
    }

    updateDocumentTypeConstruction(data: DocumentTypeConstruction): Promise<DocumentTypeConstruction>{
        return this.http.put(environment.serviceUrl + `api/v1/documenttypeconstruction/${data.id}`,
        JSON.stringify(data), {headers: this.headers})
        .toPromise().then(res => res.json());
    }

    getAllDocumentTypeConstruction() {
        return this.http
            .get(environment.serviceUrl + `api/v1/documenttypeconstruction`)
            .map((res: Response) => res.json());
    }

    getDocumentTypeConstruction(id: string): Promise<DocumentTypeConstruction> {
    return this.http.get(environment.serviceUrl + `api/v1/documenttypeconstruction/${id}`)
    .toPromise()
    .then(res => res.json());
}

    deleteDocumentTypeConstruction(data: number){
        return this.http
        .delete(environment.serviceUrl + 'api/v1/documenttypeconstruction/'+data)
        .map((res: Response) => res.json());
    }
}
