import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {FormsModule, FormControl, FormGroup} from '@angular/forms';

import {AuthenticationService} from '../../../../services/authentication.service';
import {AlertService} from '../../../../services/alert.service';
import {User} from '../../../../helpers/user';

@Component({
    selector: 'app-loginform',
    templateUrl: './loginform.component.html',
    styleUrls: ['./loginform.component.sass']
})
export class LoginformComponent implements OnInit {

    model: User;

    returnUrl: string;
    logged: boolean;

    csrf_token: string;
    csrf: string;

    form;

    Errors = [];

    @Output() onProcessing = new EventEmitter<boolean>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authService: AuthenticationService,
                private alertService: AlertService) {

        this.model = <User>{
            username: null,
            password: null,
            remember: false
        };
    }

    login() {

        this.Errors = [];

        let form = new FormData(this.form);
        form.append(this.csrf, this.csrf_token);

        this.processing(true);
        this.authService
            .login(form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        this.logged = true;
                        this.router.navigate([this.returnUrl]);

                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            let errors = data.errors.LoginForm;
                            for (let error in errors) {
                                this.Errors[error] = errors[error];
                            }
                        }
                    }
                    this.processing(false);
                },
                error => {
                    console.log(error);
                    this.alertService.alert(error.toString(), false);
                    this.processing(false);
                }
            );
    }

    processing(processing) {
        this.onProcessing.emit(processing);
    }


    ngOnInit() {
        this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
        this.form = document.querySelector('form[name=LoginForm]');

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/events';

    }

}
