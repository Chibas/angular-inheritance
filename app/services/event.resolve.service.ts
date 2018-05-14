import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {EventsService} from './events.service';
import {AlertService} from './alert.service';


@Injectable()
export class EventResolve implements OnInit {

    constructor(private eventService: EventsService,
                private alertService: AlertService,
                private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        let id = +route.params['id'];
        this.processing(true);
        return this.getItem(id)
            .then(
                data => {
                    this.processing(false);
                    return data;
                },
                error => {
                    console.log(error);
                    this.processing(false);
                    this.alertService.alert(error.toString(), true);
                    this.router.navigate(['/events']);
                    return false;
                }
            );
    }

    ngOnInit() {}

    public getItem(id) {
        return new Promise((resolve, reject) => {


            let form = new FormData();

            // send to server
            return this.eventService
                .getItem(id, form)
                .subscribe(
                    data => {
                        if (data.result === true) {
                            let post = data.data;
                            post.date_at = new Date(post.date_at * 1000);
                            post.pcAchieved = Math.floor((post.achieved / post.amount) * 100).toFixed(0);
                            resolve(post);
                        } else {
                            reject(new Error(data.errors.error));
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
        });
    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

}
