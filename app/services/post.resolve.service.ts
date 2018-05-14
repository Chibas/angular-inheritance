import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AlertService} from './alert.service';


@Injectable()
export class PostResolve implements OnInit {
    post;
    constructor(
        private alertService: AlertService,
        private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        let type = route.params['type'];
        console.log(type);
        this.processing(true);
        return this.getPost(type)
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

    public getPost(type) {
        return new Promise((resolve, reject) => {

            let csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            let csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
            let form = new FormData();
            form.append(csrf, csrf_token);

            setTimeout(() => {
                this.post = {
                    name: "About us",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.\n" +
                    "\n" +
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.\n" +
                    "\n" +
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.\n" +
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.\n" +
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.\n" +
                    "\n" +
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
                };
                resolve(this.post);
            }, 500);
        });
    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

}
