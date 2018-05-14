import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import {EventsComponent} from './components/events/events.component';
import {EditEventComponent} from './components/edit-event/edit-event.component';
import {EventComponent} from './components/event/event.component';
import {AddEventComponent} from './components/add-event/add-event.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreditCardDirectivesModule} from 'angular-cc-library';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {DateTimePickerModule} from 'ng-pick-datetime';

@NgModule({
    imports: [
        CommonModule,
        EventsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CreditCardDirectivesModule,
        CurrencyMaskModule,
        DateTimePickerModule
    ],
    declarations: [
        EventsComponent,
        EditEventComponent,
        EventComponent,
        AddEventComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EventsModule { }
