import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../../services/alert.service';
import {EventResolve} from '../../../../services/event.resolve.service';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit {

    id: number;
    post: any = null;
    userInfo;

    hidden_donate = true;

    constructor(private router: Router,
                private eventResolve: EventResolve,
                private alertService: AlertService,
                private activateRoute: ActivatedRoute) {
        this.id = +this.activateRoute.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.activateRoute.data
            .subscribe((data: { post }) => {
                this.post = data.post;
            });

        this.userInfo = JSON.parse((<any>window).localStorage.getItem('currentUser'));
    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    toggle(e) {
        if (e.target === e.currentTarget) {
            this.hidden_donate = !this.hidden_donate;
        }
    }

    close_donate(refresh: boolean) {
        this.hidden_donate = true;
        if (refresh) {
            this.processing(true);
            this.eventResolve
                .getItem(this.id)
                .then(
                    data => {
                        this.processing(false);
                        this.post = data;
                        console.log(data);
                        this.router.navigate(['/event/' + this.id]);
                    },
                    error => {
                        console.log(error);
                        this.processing(false);
                        this.alertService.alert(error.toString(), true);
                    }
                );
        }
    }

}
