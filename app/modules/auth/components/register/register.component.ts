import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {FormsModule, FormControl, EmailValidator, FormGroup} from '@angular/forms';

import {AuthenticationService} from '../../../../services/authentication.service';
import {AlertService} from '../../../../services/alert.service';
import { Registration } from '../../../../helpers/registration';
import {EqualValidatorDirective} from '../../../../validators/equel-validator.directive';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

    model: Registration;

    form: HTMLFormElement;
    csrf_token: string;
    csrf: string;

    Errors = [];

    @Output() onProcessing = new EventEmitter<boolean>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authService: AuthenticationService,
                private alertService: AlertService) {

        this.model = <Registration>{
            firstName: null,
            lastName: null,
            username: null,
            email: null,
            password: null,
            confirm: null
        };

    }


    register() {
        this.Errors = [];

        let form = new FormData(this.form);
        form.append(this.csrf, this.csrf_token);
        this.processing(true);
        this.authService
            .register(form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        this.form.reset();
                        this.alertService.alert('Confirm registration with link. Check your email please.', true);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            let errors = data.errors.RegistrationForm;
                            if (errors.length) {
                                for (let error in errors) {
                                    this.Errors[error] = errors[error];
                                }
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
        this.form = document.querySelector('form[name=RegistrationForm]') as HTMLFormElement;
    }

}
