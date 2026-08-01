import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from '../../components/resume/resume.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ResumeComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  currentLang = 'fr';

  constructor(private langService: LanguageService) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

}
