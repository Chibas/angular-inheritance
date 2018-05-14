import {Component, OnInit} from '@angular/core';

import {AlertService} from '../../services/alert.service';
import {Alert} from '../../helpers/alert';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.sass']
})
export class AlertComponent implements OnInit {

    alerts: Alert[] = [];

    constructor(private alertService: AlertService) {
    }

    ngOnInit() {
        this.alertService
            .getAlert()
            .subscribe((alert: Alert) => {
                if (!alert) {
                    // clear alerts when an empty alert is received
                    this.alerts = [];
                    return;
                }

                // add alert to array
                this.alerts.push(alert);
            });
    }

    removeAlert(index) {
        this.alerts = this.alerts.splice(1, index);
    }

}
