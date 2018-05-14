import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AlertService} from '../../../../services/alert.service';
import {EventsService} from '../../../../services/events.service';
import {PagerService} from '../../../../services/pager.service';
import {ListComponent} from '../../../../classes/list.component';
import {AuthenticationService} from '../../../../services/authentication.service';

declare var jQuery: any;


@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.sass']
})
export class EventsComponent extends ListComponent implements OnInit, AfterViewInit, OnDestroy {

    /* UNCOMMENT BOOSTRAP-SELECT.JS IN MAIN.PHP TO TURN FILTERS ON */
    pageName = 'Events list';
    logged: boolean;
    posts = [];
    Errors = [];


    // filters: Object = {  // search filter params
    //     first: '',
    //     second: ''
    // };

    // pager object
    pager: any = {
        currentPage: 0,
        pages: [],
        startPage: 1,
        totalPages: null
    };
    userInfo;
    pcAchieved: number;

    constructor(protected eventsService: EventsService,
                protected alertService: AlertService,
                protected pagerService: PagerService,
                protected route: ActivatedRoute,
                protected authService: AuthenticationService) {
        super(eventsService, alertService, pagerService, route, authService);
    }


    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    protected getDataOnInit() {
        this.logged = this.authService.logged;
        this.processing(false);
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.eventsService.clearParams();
    }

    protected afterGetList() {
        this.posts = this.items.map(el => {
            el.date_at = new Date(el.date_at * 1000);
            el.pcAchieved = Math.floor((el.achieved / el.amount) * 100).toFixed(0);
            return el;
        });
    }

    // sort(event, filter) {
    //     this.filters[filter] = event.target.value;
    // }
    //
    // find() {
    //     let form = new FormData(this.form);
    //     this.getList(form);
    // }
    //
    //
    // page(num) {
    //     if (this.pagerService.currentPage !== num) {
    //         let form = new FormData(this.form);
    //         form.append('page', num);
    //
    //         this.getList(form);
    //     }
    // }

    // private getList(form) {
    //
    //     this.processing(true);
    //     // send to server
    //     this.eventService
    //         .getList(form)
    //         .subscribe(
    //             data => {
    //                 if (data.result === true) {
    //                     this.posts = data.data.model;
    //                     this.posts.forEach((el) => {  // format date
    //                         el.date_at = new Date(el.date_at * 1000);
    //                         el.pcAchieved = Math.floor((el.achieved / el.amount) * 100).toFixed(0);
    //                     });
    //
    //                     const pagination = data.data.pagination; // server response
    //                     this.setPage(pagination.page, pagination.pageCount);
    //                 } else {
    //                     console.log(data.errors);
    //                     if (data.errors.error) {
    //                         this.alertService.alert(data.errors.error, false);
    //                     }
    //                 }
    //                 this.processing(false);
    //             },
    //             error => {
    //                 console.log(error);
    //                 this.alertService.alert(error.toString(), false);
    //                 this.processing(false);
    //             }
    //         );
    //
    // }
    //
    // private setPage(page: number, totalPages) {
    //     this.pager = this.pagerService.getPager(page, totalPages);
    // }
}
