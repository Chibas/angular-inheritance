import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../../../services/authentication.service';
import { AlertService } from '../../../../services/alert.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {

    myForm: FormGroup;
    form;

    Errors = [];

    csrf_token: string;
    csrf: string;

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private alertService: AlertService
    ) {
        this.myForm = new FormGroup({
            'username': new FormControl('', Validators.required),
        });
    }

    submit() {
        let form = new FormData(this.form);
        form.append(this.csrf, this.csrf_token);
        this.processing(true);
        // send to server
        this.authService.forgot(form).subscribe(
            data => {
                if (data.result == true) {
                    this.alertService.alert('Please check your email for password reset link', true );
                    this.router.navigate(['login'])
                } else {
                    console.log(data.errors);
                    if (data.errors.error) {
                        this.alertService.alert(data.errors.error, false);
                    } else {
                        let errors = data.errors.PasswordRestoreForm;
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

    processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    ngOnInit() {
        this.form = document.querySelector('form[name="forgotForm"]');
        this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
    }

}
