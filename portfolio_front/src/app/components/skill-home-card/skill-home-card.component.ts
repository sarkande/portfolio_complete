import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkillModel } from '../../interfaces/skill-model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-skill-home-card',
  imports: [CommonModule, StarRatingComponent, TranslateModule, RouterModule],
  templateUrl: './skill-home-card.component.html',
  styleUrl: './skill-home-card.component.scss'
})
export class SkillHomeCardComponent {
  @Input() skill!: SkillModel;

  currentLang = 'fr';

  constructor(private langService: LanguageService) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }
}
