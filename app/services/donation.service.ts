import {Injectable} from '@angular/core';
import {RequestService} from './request.service';



@Injectable()
export class DonationService extends RequestService {

    getKey(formData) {
        return this.send(formData, '/donate/get-key');
    }

    donate(id, formData) {
        return this.send(formData, '/donate/charge/' + id.toString());
    }

}
