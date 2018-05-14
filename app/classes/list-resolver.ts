/*
 * Copyright (c) 2018. AIT
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import {ListServiceInterface} from './list-service.interface';

@Injectable()
export class ListResolver implements Resolve<any> {

    constructor(protected listService: ListServiceInterface) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.getList(route, state);
    }

    getList(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let form = new FormData();
        return this.listService.getList(form);
    }

}
