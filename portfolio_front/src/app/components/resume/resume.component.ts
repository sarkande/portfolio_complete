import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NgxTimelineEvent,
  NgxTimelineItemPosition,
  NgxTimelineModule,
} from '@frxjs/ngx-timeline';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

// Import statique du JSON contenant FR/EN
import resumeData from '../../../assets/data/resume-events.json';

// Étend NgxTimelineEvent pour inclure endDate optionnel
export interface MyResumeTimelineEvent extends NgxTimelineEvent {
  endDate?: Date;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [NgxTimelineModule, CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit, OnDestroy {
  events: MyResumeTimelineEvent[] = [];
  private destroy$ = new Subject<void>();

  constructor(private langService: LanguageService) { }

  ngOnInit(): void {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang: string) => this.mapEvents(lang));
  }

  /**
   * Mappe les événements en fonction de la langue ('fr' | 'en').
   * Si la langue n'est pas reconnue, on retombe sur 'fr'.
   */
  private mapEvents(lang: string): void {
    const selectedLang = (lang === 'en' || lang === 'fr') ? lang : 'fr';
    this.events = (resumeData as any).events.map((e: any) => ({
      timestamp: new Date(e.timestamp),
      itemPosition: NgxTimelineItemPosition[
        e.itemPosition as keyof typeof NgxTimelineItemPosition
      ],
      title: e.title[selectedLang as 'fr' | 'en'],
      description: e.description[selectedLang as 'fr' | 'en'],
    }));
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}