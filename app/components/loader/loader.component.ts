import {Component, OnInit} from '@angular/core';
import {AlertService} from "../../services/alert.service";

import {trigger, state, style, transition, animate, keyframes} from '@angular/animations';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.sass'],
    animations: [
        trigger('showLoader', [
            state('true', style({
                opacity: 1,
                display: 'block'
            })),
            state('false', style({
                opacity: 0,
                display: 'none'
            })),
            transition('1 => 0', animate('1s ease-in-out')),
        ]),
    ]
})
export class LoaderComponent implements OnInit {

    show: boolean = false;

    constructor(private alertService: AlertService) {
    }

    ngOnInit() {

        this.alertService
            .getProcessing()
            .subscribe((processing: boolean = false) => {
                this.show = processing;
            });
    }


}
