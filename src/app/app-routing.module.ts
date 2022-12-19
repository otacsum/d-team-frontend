import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CourseDetailComponent} from './classes/course-detail/course-detail.component';
import {CoursesComponent} from './classes/courses.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {PeopleComponent} from './people/people.component';
import {PersonDetailComponent} from './people/person-detail/person-detail.component';

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'courses', component: CoursesComponent},
    {path: 'course/detail/:id', component: CourseDetailComponent},
    {path: 'course/create', component: CourseDetailComponent},
    {path: 'people', component: PeopleComponent},
    {path: 'person/detail/:id', component: PersonDetailComponent},
    {path: 'person/create', component: PersonDetailComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
