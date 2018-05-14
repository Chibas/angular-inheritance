import {Injectable} from '@angular/core';

import {Router, NavigationStart} from '@angular/router';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';

import {Alert} from '../helpers/alert';

@Injectable()
export class AlertService {
    private _alert = new Subject<Alert>();
    private _spinner = new Subject<boolean>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    getProcessing(): Observable<any> {
        return this._spinner.asObservable();
    }

    processing(state: boolean) {
        this._spinner.next(state);
    }

    getAlert(): Observable<any> {
        return this._alert.asObservable();
    }

    alert(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this._alert.next(<Alert>{message: message});
    }

    clear() {
        // clear alerts
        this._alert.next();
    }


}
