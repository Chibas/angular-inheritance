import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {AlertService} from '../../services/alert.service';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { EventsService } from '../../services/events.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
    @Input() title: string;
    @Input() showHeader;

    csrf_token: string;
    csrf: string;
    form;

    postsAmount: number;
    user: any;
    user_id: any;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthenticationService,
                private alertService: AlertService,
                private eventsService: EventsService
    )
    {
        // GET EVENT COUNT ON EACH ROUTE CHANGE
        router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                if (this.showHeader === true) {
                    this.getCountEvents(this.form);
                }

            }
        });

        // GET CURRENT ROUTE DATA TITLE
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data),
        )
            .subscribe((event) => this.title = (event['title']));
    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }


    ngOnInit() {
        this.form = new FormData();
        this.form.append(this.csrf, this.csrf_token);
        this.getCountEvents(this.form);

        this.user = JSON.parse((<any>window).localStorage.getItem('currentUser'));
        this.user_id = this.user.user_id;
    }

    logout() {
        let form = this.form;
        this.processing(true);

        this.authService
            .logout(form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        localStorage.removeItem('currentUser');
                        this.authService.user = null;
                        this.authService.logged = false;
                        this.router.navigate(['login']);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
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

    private getCountEvents(form) {
        this.processing(true);
        // send to server
        this.eventsService
            .getCount(form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        this.postsAmount = data.data.total;
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
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
}
