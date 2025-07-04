import { Component, Input } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommonModule } from '@angular/common';
import { SkillWithProjects } from '../../interfaces/skill-with-projects';
import {  Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-skill-card',
  imports: [StarRatingComponent, CommonModule, RouterModule],
  templateUrl: './skill-card.component.html',
  styleUrl: './skill-card.component.scss'
})
export class SkillCardComponent {
  @Input() skill!: SkillWithProjects;
  currentLang: string = 'fr';

  constructor(private langService: LanguageService, private router: Router) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }
}
