import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from '../services/authentication.service';
import 'rxjs/add/operator/toPromise';
import {AlertService} from '../services/alert.service';

@Injectable()
export class AuthGuard implements CanActivate {

    private csrf_token: string;
    private csrf: string;

    constructor(private router: Router,
                private alertService: AlertService,
                private authService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        this.processing(true);
        return this.authService
            .checkAuth()
            .map(
                data => {
                    if (data.result === true) {
                        localStorage.setItem('currentUser', JSON.stringify(data.data.User));
                        this.processing(false);
                        return this.authService.logged = true;
                    } else {
                        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                        this.processing(false);
                        return this.authService.logged = false;
                    }
                },
                error => {
                    this.processing(false);
                    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                    return this.authService.logged = false;
                }
            );
    }

    processing(inProgress) {
        this.alertService.processing(inProgress);
    }
}

