import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { environment } from '../../environments/environment';

@Injectable()
export class RequestService {
    public host: string;

    constructor(protected http: HttpClient) {
        this.host = environment.host;
    }

    private setCsrf(response, csrf_param) {
        const csrf_token = response[csrf_param];
        document.querySelector('meta[name="csrf-token"]').setAttribute('content', csrf_token);
    }

    public send(form: FormData, link) {
        const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const csrf_param = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
        form.append(csrf_param, csrf_token);
        const headers = new HttpHeaders()
            .set('Accept', 'application/json')
            .set('X-Requested-With', 'XMLHttpRequest');
        return this.http.post(this.host + link, form, { headers }).pipe(
            map(response => {
                this.setCsrf(response, csrf_param);
                return response;
            }),
            catchError(error => {
                if (error.error[csrf_param]) {
                    this.setCsrf(error.error, csrf_param);
                }
                console.log(error);
                return ErrorObservable.create(error);
            })
        );
    }
}