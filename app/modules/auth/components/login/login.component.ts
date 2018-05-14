import {Component, OnInit} from '@angular/core';
import {AlertService} from '../../../../services/alert.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthenticationService,
                private alertService: AlertService,
                private router: Router) {
    }

    ngOnInit() {
        this.processing(true);
        let user;
        if (user) {
            let form = new FormData();
            this.authService
                .checkAuth()
                .subscribe(
                    data => {
                        if (data.result === true) {
                            if (JSON.stringify(data.data.User)) {
                                user = JSON.stringify(data.data.User);
                            } else {
                                user = this.authService.dummyUser;
                            }
                            localStorage.setItem('currentUser', user);
                            this.authService.user = user;
                            this.router.navigate(['events']);
                        } else {
                            this.authService.user = null;
                        }
                        this.processing(false);
                    },
                    error => {
                        this.authService.user = null;
                        this.processing(false);
                    }
                );
        } else {
            this.processing(false);
        }
    }

    processing(inProgress) {
        this.alertService.processing(inProgress);
    }

}
