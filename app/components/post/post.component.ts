import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.sass']
})
export class PostComponent implements OnInit {
    post: any;
    proof: any;

    constructor(
        private alertService: AlertService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.data
            .subscribe((data: { post }) => {
                this.post = data.post;
            });

        this.proof = '<h3>asdsadsa</h3>';
    }

    ngOnInit() {
        console.log(this.post);
    }

    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

}
