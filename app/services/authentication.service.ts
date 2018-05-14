import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators/map';
import {catchError} from 'rxjs/operators/catchError';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AlertService} from './alert.service';

@Injectable()
export class AuthenticationService extends RequestService {

    private _logged = false;
    private _isAdmin = false;
    public isUser = false;
    public _user: any = null;
    public init: Observable<any>;
    public subj: Subject<any>;
    public dummyUser: Object;

    constructor(protected http: HttpClient, private alertService: AlertService) {
        super(http);
        this.dummyUser = {
            user_id: 1,
            first_name: 'John',
            last_name: 'Smith',
            username: 'Messy'
        };
    }

    get user(): any {
        return this._user;
    }

    set user(value: any) {
        this._user = value;
    }

    get isAdmin(): boolean {
        return this._isAdmin;
    }

    set isAdmin(value: boolean) {
        this._isAdmin = value;
    }

    get logged(): boolean {
        return this._logged;
    }

    set logged(value: boolean) {
        this._logged = value;
    }

    checkAuth() {
        this.processing(true);
        return this.check().pipe(
            map(data => {
                this.logged = data.result;
                if (data.result === true) {
                    this.user = JSON.stringify(data.data.model);
                } else {
                    this.user = null;
                }
                this.processing(false);
                return this.logged;
            }),
            catchError(error => {
                this.processing(false);
                this.logged = false;
                return ErrorObservable.create(error);
            })
        );
    }

    checkUser() {
        this.processing(true);
        return this.check_user().pipe(
            map(data => {
                this.isUser = data.result;
                this.processing(false);
                return this.isUser;
            }),
            catchError(error => {
                this.processing(false);
                this.isUser = false;
                return ErrorObservable.create(error);
            })
        );
    }

    checkAdmin() {
        this.processing(true);
        return this.check_admin().pipe(
            map(data => {
                this.isAdmin = data.result;
                this.processing(false);
                return this.isAdmin;
            }),
            catchError(error => {
                this.processing(false);
                this.isAdmin = false;
                return ErrorObservable.create(error);
            })
        );
    }

    private check() {
        const form = new FormData();
        return this.send(form, '/check/logged');
    }

    private check_user() {
        const form = new FormData();
        return this.send(form, '/check/user');
    }

    private check_admin() {
        const form = new FormData();
        return this.send(form, '/check/admin');
    }

    logout(formData) {
        return this.send(formData, '/logout');
    }

    login(formData) {
        return this.send(formData, '/login');
    }

    register(formData) {
        return this.send(formData, '/sign-up');
    }

    confirm(formData) {
        return this.send(formData, '/confirm-sign-up');
    }

    forgot(formData) {
        return this.send(formData, '/password-restore');
    }

    reset(formData) {
        return this.send(formData, '/password-reset');
    }

    processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    getDebugData() {
        return [this.logged, this.isAdmin, this.isUser, this.user, this.dummyUser];
    }



}

