import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../interfaces/project.model';
import { IconPipe } from '../../pipes/icon.pipe';
import {  RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, IconPipe, RouterModule, TranslateModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input() project!: ProjectModel;

  currentLang = 'fr';

  constructor(private langService: LanguageService) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }


}
