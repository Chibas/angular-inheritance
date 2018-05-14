import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AlertService} from '../../../../services/alert.service';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
    selector: 'app-confirm-signup',
    templateUrl: './confirm-signup.component.html',
    styleUrls: ['./confirm-signup.component.sass']
})
export class ConfirmSignupComponent implements OnInit {

    csrf_token: string;
    csrf: string;

    private token: string;

    private querySubscription: Subscription;

    constructor(private route: ActivatedRoute,
                private authService: AuthenticationService,
                private router: Router,
                private alertService: AlertService) {

    }


    ngOnInit() {
        console.log('Hi =(');
        debugger;
        this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');

        // Get query params
        this.querySubscription = this.route.queryParams.subscribe(
            (queryParam: any) => {
                this.token = queryParam['token'];
            }
        );

        let form = new FormData();
        form.append(this.csrf, this.csrf_token);
        form.append('token', this.token);
        // send to server
        this.authService
            .confirm(form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        this.alertService.alert('Thank Your for registration.', true);
                        console.log('Token valid ' + this.token);
                        localStorage.setItem('currentUser', JSON.stringify(data.data.User));
                        let user = localStorage.getItem('currentUser');
                        if (user) {
                            this.authService.user = user;
                            this.router.navigate(['events']);
                        }

                    } else {
                        console.log('Token invalid');
                        console.log(data.errors);
                        let error_msg = (data.errors.error) ? data.errors.error : 'Confirmation token is invalid!';
                        this.alertService.alert(error_msg, true);
                        this.router.navigate(['login']);
                    }
                },
                error => {
                    console.log(error);
                    this.alertService.alert(error.toString(), false);
                }
            );
    }

}
