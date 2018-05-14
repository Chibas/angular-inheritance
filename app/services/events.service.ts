import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {ListServiceInterface} from '../classes/list-service.interface';

@Injectable()
export class EventsService extends RequestService implements ListServiceInterface {


    searchParams: Object = {
        status: []
    };

    getCount(formData) {
        return this.send(formData, '/event/count');
    }

    getList(formData) {
        return this.send(formData, '/event');
    }

    getItem(id, formData) {
        return this.send(formData, '/event/view/' + id.toString());
    }

    addItem(formData) {
        return this.send(formData, '/event/create');
    }

    editItem(id, formData) {
        return this.send(formData, '/event/update/' + id.toString());
    }
    deleteItem(id, formData) {
        return this.send(formData, '/event/delete/' + id.toString());
    }

    setSearchParam(paramName, param) {
        if (!this.searchParams[paramName]) {
            Object.defineProperty(this.searchParams, paramName, {
                value: param,
                writable: true,
                enumerable: true
            });
        } else if (Array.isArray(this.searchParams[paramName])) {
            this.searchParams[paramName].push(param);
        } else {
            this.searchParams[paramName] = param;
        }
    }

    getSearchParam() {
        return this.searchParams;
    }

    clearParams() {
        for (const prop in this.searchParams) {
            if (Array.isArray(this.searchParams[prop])) {
                this.searchParams[prop].length = 0;
            } else {
                this.searchParams[prop] = '';
            }
        }
    }

}
