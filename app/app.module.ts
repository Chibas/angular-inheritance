// BASIC MODULES
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_BASE_HREF, DatePipe, Location} from '@angular/common';

// CUSTOM COMPONENTS
import {AppComponent} from './components/app.component';
import {HeaderComponent} from './components/header/header.component';
import {ProfileComponent} from './components/profile/profile.component';
import {FooterComponent} from './components/footer/footer.component';
import {AlertComponent} from './components/alert/alert.component';
import {LoaderComponent} from './components/loader/loader.component';
import {TeamComponent} from './components/team/team.component';
import {DonateComponent} from './components/donate/donate.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PostComponent } from './components/post/post.component';


// SERVICES
import {EventsService} from './services/events.service';
import {PagerService} from './services/pager.service';
import {AuthenticationService} from './services/authentication.service';
import {AlertService} from './services/alert.service';
import {DonationService} from './services/donation.service';
import {EventResolve} from './services/event.resolve.service';
import {ProfileResolve} from './services/profile.resolve.service';
import { PostResolve } from './services/post.resolve.service';

// ACCESSORIES

import {routes} from './app.routes';
import {AuthGuard} from './helpers/auth.guard';
import {EqualValidatorDirective} from './validators/equel-validator.directive';
import {FileValidator} from './validators/fileValidator.directive';

// LIBS
import {DateTimePickerModule} from 'ng-pick-datetime';
import {ImageCropperComponent, CropperSettings, Bounds} from './components/cropper';
import {CreditCardDirectivesModule} from 'angular-cc-library';
import {CurrencyMaskModule} from 'ng2-currency-mask';

// MATERIAL
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ProfileComponent,
        FooterComponent,
        EqualValidatorDirective,
        FileValidator,
        TeamComponent,
        LoaderComponent,
        AlertComponent,
        ImageCropperComponent,
        DonateComponent,
        EditProfileComponent,
        PostComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        routes,
        DateTimePickerModule,
        CreditCardDirectivesModule,
        CurrencyMaskModule,
        MatExpansionModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatButtonModule
    ],
    providers: [
        AuthenticationService,
        AuthGuard,
        AlertService,
        EventsService,
        FileValidator,
        PagerService,
        DonationService,
        EventResolve,
        ProfileResolve,
        PostResolve,
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
