import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ProjectModel } from '../interfaces/project.model';
import { SkillModel } from '../interfaces/skill-model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private base = '/projects';

  constructor(private apiService: ApiService) { }

  createProject(projectData: ProjectModel): Observable<any> {
    return this.apiService.post(`${this.base}`, projectData);
  }
  updateProject(project_slug: string, projectData: ProjectModel): Observable<any> {
    return this.apiService.put(`/projects/${project_slug}`, projectData);
  }

  getProject(project_slug: string): Observable<ProjectModel> {
    return this.apiService.get(`${this.base}/${project_slug}`);
  }
  getProjects(): Observable<ProjectModel[]> {
    return this.apiService.get(`${this.base}`);
  }
  getLastProjects(): Observable<ProjectModel[]> {
    return this.apiService.get(`${this.base}/last_projects`);
  }
  deleteProject(project_slug: string): Observable<any> {
    return this.apiService.delete(`/projects/${project_slug}`);
  }
  addSkill(slug: string, skill: SkillModel): Observable<ProjectModel> {
    return this.apiService.post<ProjectModel>(`${this.base}/${slug}/skills/${skill.id}`, skill);
  }
  removeSkill(slug: string, skillId: number): Observable<ProjectModel> {
    return this.apiService.delete<ProjectModel>(`${this.base}/${slug}/skills/${skillId}`);
  } 
}
