import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {RouterModule, Routes, Router, ActivatedRoute, Event, NavigationEnd} from '@angular/router';

import {AlertService} from '../services/alert.service';
import {Title} from '@angular/platform-browser';
import { Location } from '@angular/common';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

    destination: string;

    showHeader: boolean = false;
    showFooter: boolean = false;
    urlAfterRedirects: string;
    user: any;
    logged: boolean;
    isAdmin: boolean;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthenticationService,
                private titleService: Title,
                private location: Location) {

        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.showHeader = this.authService.logged;
                this.showFooter = this.authService.logged;
                console.log('Route changed ');
                console.log(event.urlAfterRedirects);

                if (event.urlAfterRedirects.includes('login')) {
                    this.showHeader = false;
                    this.showFooter = false;
                } else {
                    this.showHeader = true;
                    this.showFooter = true;
                }
            }
        });

        this.destination = window.location.pathname;
    }

    ngOnInit() {
        this.authService.subj = new Subject();
        this.authService
            .checkAuth()
            .pipe(
                map(response => {
                    this.user = JSON.parse(this.authService.user);
                    this.logged = this.authService.logged;
                    this.isAdmin = this.authService.isAdmin;
                }),
                // SUBSCRIBE FOR ROUTE CHANGE AND CHECK LOGIN STATE
                map(() => {
                    this.router.events
                        .pipe(
                            filter(event => event instanceof NavigationEnd),
                            map((event: NavigationEnd) => {
                                this.urlAfterRedirects = event.urlAfterRedirects;
                                let route = this.activatedRoute;
                                while (route.firstChild) {
                                    route = route.firstChild;
                                }
                                this.scrollToTop();

                                return route;
                            }),
                            filter(route => route.outlet === 'primary'),
                            map(route => {
                                this.user = JSON.parse(this.authService.user);
                                this.logged = this.authService.logged;
                                this.isAdmin = this.authService.isAdmin;
                                return route.data;
                            })
                        )
                        .subscribe(
                            event => {
                                this.titleService.setTitle(event['title']);
                            },
                            error => {
                                console.log(error);
                            }
                        );
                }),
                // CHECK FOR ADMIN
                mergeMap(data => {
                    if (this.logged) {
                        return this.authService.checkAdmin().pipe(
                            map(permit => {
                                this.isAdmin = this.authService.isAdmin = permit;
                                if (!this.urlAfterRedirects) {
                                    this.urlAfterRedirects = this.location.path(false);
                                }
                                if (permit === true && !this.urlAfterRedirects.startsWith('/admin')) {
                                    return this.router.navigate(['/admin']);
                                }
                                return Observable.of(this.logged);
                            }),
                            catchError(error => {
                                this.isAdmin = this.authService.isAdmin = false;
                                return error;
                            })
                        );
                    }
                    return Observable.of(this.logged);
                }),
                catchError(error => {
                    this.logged = false;
                    return error;
                })
            )
            .subscribe(this.authService.subj);

        this.authService.init = new Observable(observer => this.authService.subj.subscribe(observer));
        this.showHeader = this.authService.logged;
        this.showFooter = this.authService.logged;

    }

    scrollToTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

}
