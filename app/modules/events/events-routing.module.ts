import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventsComponent} from './components/events/events.component';
import {EventResolve} from '../../services/event.resolve.service';
import {AuthGuard} from '../../helpers/auth.guard';
import {EventComponent} from './components/event/event.component';
import {EditEventComponent} from './components/edit-event/edit-event.component';
import {AddEventComponent} from './components/add-event/add-event.component';

const EventsRoutes: Routes = [
    {
        path: 'event/:id',
        component: EventComponent,
        resolve: {
            post: EventResolve
        },
        data: {title: 'Event'}
    },
    {
        path: 'edit-event/:id',
        component: EditEventComponent,
        resolve: {
            post: EventResolve
        },
        data: {
            title: 'Edit Event'
        }
    },
    {path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard], data: {title: 'Add Event'}},

]

const routes: Routes = [
    { path: '', component: EventsComponent, resolve: EventResolve, children: EventsRoutes  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
