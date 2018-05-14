/*
 * Copyright (c) 2018. AIT
 */

import {Injectable, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {AuthenticationService} from '../services/authentication.service';
import {ListServiceInterface} from './list-service.interface';

@Injectable()
export class FormComponent implements OnInit {
    id;
    Errors = [];
    form: FormGroup;

    constructor(protected route: ActivatedRoute,
                protected router: Router,
                protected formBuilder: FormBuilder,
                protected listService: ListServiceInterface,
                protected alertService: AlertService,
                protected authService: AuthenticationService) {
    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    protected createForm() {
    }

    protected getDataOnInit() {
    }

    ngOnInit() {
        this.processing(true);
        this.createForm();

        if (!this.authService.subj.isStopped) {
            this.authService.init.subscribe(() => {
                this.getDataOnInit();
            });
        } else {
            this.getDataOnInit();
        }
    }

    protected errorOnCreate(_data) {
    }

    protected afterCreate(_data) {
        return this.populateControls(_data.data.model);
    }

    protected errorOnUpdate(_data) {
    }

    protected afterUpdate(_data) {
    }

    protected prepareSend(form, _data) {
    }

    protected populateControls(_data) {
        Object.keys(this.form.controls).forEach((item: any) => {
            if (_data.hasOwnProperty(item) && !Array.isArray(_data[item])) {
                (<FormArray>this.form.controls[item]).patchValue(_data[item]);
            }
        });

        this.form.markAsPristine();
    }

    create(_data) {
        if (_data.pristine) {
            return;
        }
        if (_data.valid) {
            const form = new FormData();
            this.prepareSend(form, _data);
            this.processing(true);
            return this.listService.addItem(form).subscribe(
                (data: any) => {
                    if (data.result === true) {
                        this.processing(false);
                        return this.afterCreate(data);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            const errors = data.errors.model;
                            Object.keys(errors).map(error => {
                                this.Errors[error] = errors[error];
                            });
                        }
                    }
                    this.processing(false);
                    this.errorOnCreate(data);
                    return false;
                },
                error => {
                    console.log(error);
                    this.alertService.alert(error.message, false);
                    this.processing(false);
                    this.errorOnCreate(error);
                    return false;
                }
            );
        } else {
            this.markFormGroupTouched(_data);
            return ErrorObservable.create('Some fields are invalid!'); // {4}
        }
    }

    update(_data) {
        if (_data.valid) {
            const form = new FormData();
            this.prepareSend(form, _data);
            this.processing(true);
            return this.listService.editItem(this.id, form).subscribe(
                (data: any) => {
                    if (data.result === true) {
                        this.processing(false);
                        return this.afterUpdate(data);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            const errors = data.errors.model;
                            Object.keys(errors).map(error => {
                                this.Errors[error] = errors[error];
                            });
                        }
                    }
                    this.processing(false);
                    this.errorOnUpdate(data);
                    return false;
                },
                error => {
                    console.log(error);
                    this.alertService.alert(error.message, false);
                    this.processing(false);
                    this.errorOnUpdate(error);
                    return false;
                }
            );
        } else {
            this.markFormGroupTouched(_data);
            return ErrorObservable.create('Some fields are invalid!'); // {4}
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                control.controls.forEach(c => {
                    if (c.controls) {
                        // if formGroup
                        this.markFormGroupTouched(c);
                    } else {
                        // if formControl
                        c.markAsTouched();
                    }
                });
            }
        });
    }

    reset(_form) {
        _form.reset();
    }
}
