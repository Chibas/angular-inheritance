/*
 * Copyright (c) 2018. AIT
 */

import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import {ListResolver} from '../../../classes/list-resolver';
import {EventsService} from '../../../services/events.service';

@Injectable()
export class CandidatesListResolver extends ListResolver implements Resolve<any> {

    constructor(protected eventsService: EventsService) {
        super(eventsService);
    }
}