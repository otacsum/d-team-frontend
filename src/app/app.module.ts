// Angulare Core stuff
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Angular Materials
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';

// Components
import {AppComponent} from './app.component';
import {CoursesComponent} from './classes/courses.component';
import {CourseDetailComponent} from './classes/course-detail/course-detail.component';
import {PeopleComponent} from './people/people.component';
import {PersonDetailComponent} from './people/person-detail/person-detail.component';
import {MessagesComponent} from './messages/messages.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {ConfirmDeleteComponent} from './confirm-delete/confirm-delete.component'

@NgModule({
    declarations: [
        AppComponent,
        CoursesComponent,
        CourseDetailComponent,
        PeopleComponent,
        PersonDetailComponent,
        MessagesComponent,
        DashboardComponent,
        LoginComponent,
        ConfirmDeleteComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule,
        MatTableModule,
        MatDialogModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
