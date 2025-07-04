import { Component, Input } from '@angular/core';
import { ProjectModel } from '../../interfaces/project.model';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-project-home-card',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './project-home-card.component.html',
  styleUrl: './project-home-card.component.scss'
})
export class ProjectHomeCardComponent {
  @Input() project!: ProjectModel;
  @Input() reverse: boolean = false;
  currentLang: string = 'fr';
  
  constructor(private translate: TranslateService, private langService: LanguageService, private router: Router) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }
}
