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
import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SkillComponent } from './pages/skill/skill.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogArticleComponent } from './pages/blog-article/blog-article.component';


const childRoutes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'title.home' } },
  { path: 'skills', component: SkillListComponent, data: { title: 'title.skills' } },
  { path: 'skills/:name', component: SkillComponent, data: { title: 'title.skillDetail' } },
  { path: 'projects', component: ProjectListComponent, data: { title: 'title.projects' } },
  { path: 'projects/:slug', component: ProjectComponent, data: { title: 'title.projectDetail' } },
  { path: 'blog', component: BlogListComponent, data: { title: 'title.blog' } },
  { path: 'blog/:slug', component: BlogArticleComponent, data: { title: 'title.blogDetail' } },

  { path: 'legal-notice', component: LegalNoticeComponent, data: { title: 'title.legalNotice' } },
  { path: 'about', component: AboutComponent, data: { title: 'title.about' } },
  { path: 'login', component: LoginComponent, data: { title: 'title.login' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'title.profile' } },
  {
    path: 'panel',
    component: PanelAdminComponent,
    canActivate: [AuthGuard],
    data: { title: 'title.adminPanel' }
  },
  { path: '404', component: ErrorNotFoundComponent, data: { title: 'title.notFound' } },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];


export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LangGuard],
    data: { title: 'title.home' },
    children: childRoutes,
  },
  { path: '', redirectTo: 'fr', pathMatch: 'full' },
  { path: '**', redirectTo: 'fr/404', pathMatch: 'full' },
];