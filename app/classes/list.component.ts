/*
 * Copyright (c) 2018. AIT
 */

import {Injectable, OnInit} from '@angular/core';
import {Pager} from './pager';
import {PagerService} from '../services/pager.service';
import {AlertService} from '../services/alert.service';
import {ActivatedRoute} from '@angular/router';
import {ListServiceInterface} from './list-service.interface';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class ListComponent implements OnInit {

    items = [];
    Errors = [];

    // pager object
    pager: Pager = new Pager();

    constructor(protected listService: ListServiceInterface,
                protected alertService: AlertService,
                protected pagerService: PagerService,
                protected route: ActivatedRoute,
                protected authService: AuthenticationService) {
    }

    protected getDataOnInit() {
    }

    protected beforeGetDataOnInit() {
    }

    public ngOnInit() {
        this.processing(true);

        this.beforeGetDataOnInit();
        let data = this.route.snapshot.data.info;
        this.handleData(data);

        if (!this.authService.subj.isStopped) {
            this.authService.init.subscribe(() => {
                this.getDataOnInit();
            });
        } else {
            this.getDataOnInit();
        }

    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    public sort(event) {
        let form = new FormData();
        this.getList(form);
    }

    public search(_data) {
        let form = new FormData();
        this.getList(form);
    }

    public page(num) {
        if (this.pagerService.currentPage !== num) {
            let form = new FormData();
            form.append('page', num);

            this.getList(form);
        }
    }

    protected afterGetList() {

    }

    protected handleData(data: any) {
        if (!data) {
            return false;
        }
        if (data.result === true) {
            this.items = data.data.model;
            this.afterGetList();
            const pagination: any = data.data.pagination; // server response
            this.setPage(pagination.page, pagination.pageCount);
        } else {
            console.log(data.errors);
            if (data.errors.error) {
                this.alertService.alert(data.errors.error, false);
            }
        }
    }

    protected getList(form) {

        this.processing(true);
        // send to server
        this.listService
            .getList(form)
            .subscribe(
                (data: any) => {
                    this.handleData(data);
                    this.processing(false);
                },
                error => {
                    console.log(error);
                    this.alertService.alert(error.message, false);
                    this.processing(false);
                }
            );

    }

    private setPage(page: number, totalPages) {
        this.pager = this.pagerService.getPager(page, totalPages);
    }

}
