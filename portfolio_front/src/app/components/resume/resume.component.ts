import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  NgxTimelineEvent,
  NgxTimelineItemPosition,
  NgxTimelineModule,
} from '@frxjs/ngx-timeline';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import resumeData from '../../../assets/data/resume-events.json';
import {  RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface MyResumeTimelineEvent extends NgxTimelineEvent {
  endDate?: Date;
  company?: { name: string; logo: string; url?: string };
  school?: { name: string; logo: string; url?: string };
  certificationName?: string;
  issuer?: string;
  role?: string;
  status?: string;
  missions?: string[];
  skills?: string[];
  projects?: string[];
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [NgxTimelineModule, CommonModule, RouterModule, TranslateModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit, OnDestroy {
  events: MyResumeTimelineEvent[] = [];
  private destroy$ = new Subject<void>();
  isMobile = false;
  currentLang: 'fr' | 'en' = 'fr';

  constructor(private langService: LanguageService) { }

  ngOnInit(): void {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang: string) => {
        this.currentLang = lang === 'en' ? 'en' : 'fr';
        this.mapEvents(this.currentLang);
      });
    this.checkWindow();
  }

  @HostListener('window:resize')
  checkWindow() {
    this.isMobile = window.innerWidth < 900;
  }

  private mapEvents(lang: 'fr' | 'en'): void {
    this.events = (resumeData as any).events.map((e: any) => ({
      timestamp: new Date(e.timestamp),
      endDate: e.endDate ? new Date(e.endDate) : undefined,
      itemPosition: NgxTimelineItemPosition[
        e.itemPosition as keyof typeof NgxTimelineItemPosition
      ],
      title: e.title[lang],
      description: e.description[lang],
      company: e.company,
      school: e.school,
      certificationName: e.certificationName,
      issuer: e.issuer,
      role: e.role,
      status: e.status,
      missions: e.missions,
      skills: e.skills,
      projects: e.projects,
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}