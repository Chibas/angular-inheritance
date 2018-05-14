import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './helpers/auth.guard';
// import {LoginComponent} from './components/login/login.component';
// import {EventComponent} from './components/event/event.component';
import {ProfileComponent} from './components/profile/profile.component';
// import {AddEventComponent} from './components/add-event/add-event.component';
// import {ConfirmSignupComponent} from './components/confirm-signup/confirm-signup.component';
// import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
// import {PasswordResetComponent} from './components/password-reset/password-reset.component';
// import {RegisterComponent} from './components/register/register.component';
// import {EventsComponent} from './components/events/events.component';
import { DonateComponent } from './components/donate/donate.component';
// import { EditEventComponent } from './components/edit-event/edit-event.component';
// import { EventResolve } from './services/event.resolve.service';
// import {EditProfileComponent} from './components/edit-profile/edit-profile.component'
import {ProfileResolve} from './services/profile.resolve.service';
import {PostResolve} from './services/post.resolve.service';
import {PostComponent} from './components/post/post.component';

// const loginRoutes: Routes = [
//     {path: '', component: RegisterComponent},
//     {path: 'forgot-password', component: ForgotPasswordComponent},
//     {path: 'password-reset', component: PasswordResetComponent},
// ];

export const router: Routes = [
    {path: '', redirectTo: '/events', pathMatch: 'full', data: { title: 'Events List' }},
    {path: 'login', loadChildren: './modules/auth/auth.module#AuthModule'},
    {path: 'password-reset', redirectTo: 'login/password-reset', data: {title: 'Reset password'}},
    {path: 'confirm-sign-up', redirectTo: 'login/confirm-sign-up', data: {title: 'Confirm sign up'}},
    {path: 'events', loadChildren: './modules/events/events.module#EventsModule'},
    {
        path: 'profile/:id',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        resolve: {
            profile: ProfileResolve
        },
        data: {title: 'Profile'}
    },

    {path: 'donate', component: DonateComponent, data: {title: 'Donate'}},

    {
        path: 'post/:type',
        component: PostComponent,
        resolve: {
            post: PostResolve
        },
        data: {
            title: 'Posts'
        }
    },
    {path: '**', redirectTo: '/login'}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);