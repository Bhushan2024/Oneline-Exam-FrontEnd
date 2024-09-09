import { Routes } from '@angular/router';
import { RegisterComponent } from './User/register/register.component';
import { LoginComponent } from './User/login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './User/user/user.component';
import { authGuard } from './guards/auth.guard';
import { ExamComponent } from './User/exam/exam.component';
import { SectionComponent } from './User/section/section.component';
import { ResultHistoryComponent } from './User/result-history/result-history.component';
import { AdminResultComponent } from './admin/admin-result/admin-result.component';
import { AdminReportComponent } from './admin/admin-report/admin-report.component';
import { AdminExamComponent } from './admin/admin-exam/admin-exam.component';
import { AdminSectionComponent } from './admin/admin-section/admin-section.component';
import { ResultComponent } from './User/result/result.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin-dashboard', component: AdminComponent, canActivate: [authGuard], data: { role: ['Admin'] } },
    { path: 'admin-result', component: AdminResultComponent, canActivate: [authGuard], data: { role: ['Admin'] } },
    { path: 'admin-report', component: AdminReportComponent, canActivate: [authGuard], data: { role: ['Admin'] } },
    { path: 'admin-exam', component: AdminExamComponent, canActivate: [authGuard], data: { role: ['Admin'] } },
    { path: 'admin-section', component: AdminSectionComponent },

    { path: 'user-dashboard', component: UserComponent, canActivate: [authGuard], data: { role: ['User'] } },
    { path: 'exam', component: ExamComponent, canActivate: [authGuard], data: { role: ['User'] } },
    { path: 'exam/:examId', component: SectionComponent, canActivate: [authGuard], data: { role: ['User'] } },
    { path: 'exam-result', component: ResultHistoryComponent, canActivate: [authGuard], data: { role: ['User'] } },
    { path: 'result', component: ResultComponent, canActivate: [authGuard], data: { role: ['User'] } },

    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
