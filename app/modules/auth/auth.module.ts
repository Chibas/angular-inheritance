import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { LoginformComponent } from './components/loginform/loginform.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginComponent,
        LoginformComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        PasswordResetComponent,
        ConfirmSignupComponent
    ]
})
export class AuthModule { }
