import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkillModel } from '../../interfaces/skill-model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-skill-home-card',
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './skill-home-card.component.html',
  styleUrl: './skill-home-card.component.scss'
})
export class SkillHomeCardComponent {
  @Input() skill!: SkillModel;
}
