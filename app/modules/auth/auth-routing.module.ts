import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {PasswordResetComponent} from './components/password-reset/password-reset.component';
import {LoginComponent} from './components/login/login.component';
import {ConfirmSignupComponent} from './components/confirm-signup/confirm-signup.component';

const authRoutes: Routes = [
    { path: '', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'confirm-sign-up', component: ConfirmSignupComponent },
];

const routes: Routes = [
    { path: '', component: LoginComponent, children: authRoutes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
