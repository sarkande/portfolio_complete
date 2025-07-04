import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SkillModel } from '../interfaces/skill-model';
import { Observable } from 'rxjs';
import { SkillWithProjects } from '../interfaces/skill-with-projects';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  constructor(private apiService: ApiService) { }

  createSkill(projectData: SkillModel): Observable<any> {
    return this.apiService.post('/skills', projectData);
  }
  updateSkill(skillID: number, projectData: SkillModel): Observable<any> {
    return this.apiService.put('/skills/' + skillID, projectData);
  }

  getSkill(skillName: string): Observable<SkillModel> {
    return this.apiService.get('/skills/' + skillName);
  }
  getSkills(): Observable<SkillWithProjects[]> {
    return this.apiService.get('/skills');
  }
  getLastSkills(): Observable<SkillWithProjects[]> {
    return this.apiService.get('/skills/last_skills');
  }

  deleteSkill(skillName: string): Observable<any> {
    return this.apiService.delete('/skills/' + skillName);
  }

}