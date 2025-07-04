import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectComponent } from './pages/project/project.component';
import { LoginComponent } from './pages/login/login.component';
import { PanelAdminComponent } from './pages/panel-admin/panel-admin.component';
import { AuthGuard } from './guards/auth.guard';
import { ErrorNotFoundComponent } from './pages/error-not-found/error-not-found.component';
import { LangGuard } from './guards/lang.guard';
import { SkillListComponent } from './pages/skill-list/skill-list.component';


const childRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'skills', component: SkillListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/:slug', component: ProjectComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'panel',
    component: PanelAdminComponent,
    canActivate: [AuthGuard],
  },
  { path: '404', component: ErrorNotFoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];

export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LangGuard],
    children: childRoutes,
  },
  { path: '', redirectTo: 'fr', pathMatch: 'full' },
  { path: '**', redirectTo: 'fr/404', pathMatch: 'full' },
];