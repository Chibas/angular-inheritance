import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AlertService} from '../../services/alert.service';
import {DonationService} from '../../services/donation.service';
import {CreditCardValidator} from "angular-cc-library";
import 'rxjs/operator/toPromise';

@Component({
    selector: 'app-donate',
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.sass']
})
export class DonateComponent implements OnInit {

    @Output() closed = new EventEmitter<boolean>();
    @Input() eventId: number;

    donateForm: FormGroup;

    csrf_token: string;
    csrf: string;

    Errors: any = [];

    constructor(private formBuilder: FormBuilder,
                private alertService: AlertService,
                private donationService: DonationService) {
    }

    ngOnInit() {
        this.donateForm = this.formBuilder.group({
            amount: ['', [<any>Validators.required]],
            creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
            expirationDate: ['', [<any>CreditCardValidator.validateExpDate]],
            cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]]
        });

        this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
    }

    private processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    submit(_form) {

        this.Errors = [];
        this.processing(true);
        this.doDonate(_form)
            .then(
                (data: any) => {
                    if (data.result === true) {
                        this.alertService.alert('Your donation has been received. Thank you!', true);
                        this.processing(false);
                        this.close(true);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            let errors = data.errors.RegistrationForm;
                            for (let error in errors) {
                                this.Errors[error] = errors[error];
                            }
                        }
                    }
                    this.processing(false);
                },
                error => {
                    console.log(error);
                    this.processing(false);
                    this.alertService.alert(error.toString(), false);
                }
            );
    }

    private getKey() {
        let form = new FormData();
        form.append(this.csrf, this.csrf_token);
        return this.donationService
            .getKey(form)
            .toPromise()
    }

    private getToken(data: any, _form: any) {
        return new Promise((resolve, reject) => {
            (<any>window).Stripe.setPublishableKey(data.data.key);
            let expiryMatches = _form.value.expirationDate.match(/([0-9]{2}) \/ ([0-9]{4})/);
            (<any>window).Stripe.card.createToken({
                number: _form.value.creditCard,
                exp_month: expiryMatches[1],
                exp_year: expiryMatches[2],
                cvc: _form.value.cvc
            }, (status: number, response: any) => {
                if (status === 200) {
                    resolve(response.id);
                } else {
                    reject(new Error(response.error.message));
                }
            });
        });
    }

    private requstDonate(data: any, _form: any) {
        let form = new FormData();
        let expiryMatches = _form.value.expirationDate.match(/([0-9]{2}) \/ ([0-9]{4})/);

        form.append(this.csrf, this.csrf_token);
        form.append('DonateForm[stripeToken]', data);
        form.append('DonateForm[amount]', _form.value.amount);
        form.append('DonateForm[cardNumber]', _form.value.creditCard);
        form.append('DonateForm[expirationMonth]', expiryMatches[1]);
        form.append('DonateForm[expirationYear]', expiryMatches[2]);
        form.append('DonateForm[cvv]', _form.value.cvc);

        return this.donationService
            .donate(this.eventId, form)
            .toPromise();
    }

    private doDonate(_form) {
        return new Promise((resolve, reject) => {
            return this.getKey()
                .then(
                    (data: any) => {
                        return this.getToken(data, _form)
                            .then(
                                (data: string) => {
                                    return this.requstDonate(data, _form)
                                        .then(
                                            data => {
                                                resolve(data);
                                            },
                                            error => {
                                                reject(error);
                                            }
                                        );
                                },
                                error => {
                                    reject(error);
                                }
                            )
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    close(refresh: boolean = false) {
        this.closed.emit(refresh);
        this.donateForm.reset();
    }

}


