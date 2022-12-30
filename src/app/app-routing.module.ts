import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CourseDetailComponent} from './courses/course-detail/course-detail.component';
import {CoursesComponent} from './courses/courses.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {PeopleComponent} from './people/people.component';
import {PersonDetailComponent} from './people/person-detail/person-detail.component';
import {StudentCoursesComponent} from './student-courses/student-courses.component';
import {TeacherCredentialComponent} from './teacher-credentials/teacher-credential.component';
import {TeacherCredentialDetailComponent} from './teacher-credentials/teacher-credential-detail/teacher-credential-detail.component';
import {AssignmentDetailComponent} from './assignments/assignment-detail/assignment-detail.component';
import {AssignmentGradeComponent} from './assignment-grades/assignment-grades.component';

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'courses', component: CoursesComponent},
    {path: 'courses/student', component: StudentCoursesComponent},
    {path: 'course/:id', component: CourseDetailComponent},
    {path: 'course/create', component: CourseDetailComponent},
    {path: 'people', component: PeopleComponent},
    {path: 'person/:id', component: PersonDetailComponent},
    {path: 'person/create', component: PersonDetailComponent},
    //{path: 'teacher/credential', component: TeacherCredentialComponent},
    {path: 'teacher/:teacherId/credential/:id', component: TeacherCredentialDetailComponent},
    {path: 'teacher/:teacherId/credential/create', component: TeacherCredentialDetailComponent},
    {path: 'course/:courseId/assignment/:id', component: AssignmentDetailComponent},
    {path: 'course/:courseId/assignment/create', component: AssignmentDetailComponent},
    {path: 'course/:courseId/gradebook', component: AssignmentGradeComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
