import {Component, OnInit} from '@angular/core';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';
import {AlertService} from '../../../../services/alert.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.sass']
})
export class PasswordResetComponent implements OnInit {

    resetForm: FormGroup;
    form;

    private token: string;
    private querySubscription: Subscription;

    Errors = [];

    csrf_token: string;
    csrf: string;

    constructor(private route: ActivatedRoute,
                private authService: AuthenticationService,
                private router: Router,
                private alertService: AlertService) {

        this.resetForm = new FormGroup({
            'password': new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            'passwordRepeat': new FormControl('', [
                Validators.required,
            ]),
        });

    }

    submit() {

        this.Errors = [];

        let form = new FormData(this.form);
        form.append(this.csrf, this.csrf_token);
        form.append('token', this.token);

        this.processing(true);
        this.authService
            .reset(form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        this.alertService.alert('Your password has been reset. Now you can to log in.', true);
                        this.router.navigate(['login']);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            let errors = data.errors.PasswordResetForm;
                            if (errors['recoveryToken']){
                                this.alertService.alert(errors['recoveryToken'], true);
                                this.router.navigate(['login'])
                            }
                            for (let error in errors) {
                                this.Errors[error] = errors[error];
                            }
                        }
                        this.processing(false);
                    }
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
        this.form = document.querySelector('form[name=resetForm]');
        this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');

        // Get query params
        this.querySubscription = this.route.queryParams.subscribe(
            (queryParam: any) => {
                this.token = queryParam['token'];
                if (!this.token) {
                    this.router.navigate(['login']);
                }
            }
        );
    }

}
