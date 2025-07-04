import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { SkillService } from '../../services/skill.service';
import { ProjectModel } from '../../interfaces/project.model';
import { SkillModel } from '../../interfaces/skill-model';
import { ResumeComponent } from '../../components/resume/resume.component';
import { ProjectHomeCardComponent } from '../../components/project-home-card/project-home-card.component';
import { SkillHomeCardComponent } from '../../components/skill-home-card/skill-home-card.component';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, RouterModule, CommonModule, ResumeComponent, ProjectHomeCardComponent, SkillHomeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  // Propriétés de gestion de la langue et des clés de traduction
  public currentLang: string = 'fr';
  public titleList: string[] = [];
  public descriptionList: string[] = [];
  public titleKey: string = 'home.title1';

  // Propriétés de gestion de l'animation de saisie
  public lastRandomIndex: number | null = null;
  public isTitleTyping: boolean = false;

  rawProjects: ProjectModel[] = [];
  rawSkills: SkillModel[] = [];
  projects: ProjectModel[] = [];
  skills: SkillModel[] = [];
  private destroy$ = new Subject<void>();

  // Références aux éléments du DOM
  @ViewChild('titleEl') titleEl!: ElementRef<HTMLElement>;
  // @ViewChild('descEl') descEl!: ElementRef<HTMLElement>;

  constructor(
    private langService: LanguageService,
    private translate: TranslateService,
    private projectService: ProjectService,
    private skillService: SkillService,
    private router: Router
  ) {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang: string) => {
        this.currentLang = lang;
        this.translateAll();
      });

    for (let i = 1; i <= 10; i++) {
      this.titleList.push(`home.title${i}`);
      this.descriptionList.push(`home.description${i}`);
    }
  }
  ngOnInit(): void {
    // Chargement des projets et compétences
    this.projectService
      .getLastProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects: ProjectModel[]) => {
        this.rawProjects = projects;
        this.translateProjects();
      });

    this.skillService
      .getLastSkills()
      .pipe(takeUntil(this.destroy$))
      .subscribe((skills: SkillModel[]) => {
        this.rawSkills = skills;
        this.translateSkills();
      });
  }

  /**
   * Méthode du cycle de vie Angular appelée après l'initialisation de la vue du composant.
   * Lance les animations de saisie initiales et configure l'intervalle de mise à jour.
   */
  public async ngAfterViewInit(): Promise<void> {
    await this.triggerTyping(
      this.titleEl.nativeElement,
      this.titleKey,
      'title'
    );


    setInterval(() => {
      this.setRandomTitleAndDescription();
    }, 3000);
  }

  /**
   * Déclenche l'animation de saisie sur un élément donné.
   * Gère les flags d'état et la récupération de la traduction.
   * @param element L'élément HTML sur lequel taper le texte.
   * @param key La clé de traduction à utiliser.
   * @param type Le type d'élément ('title' ou 'description') pour gérer les flags spécifiques.
   */
  private async triggerTyping(
    element: HTMLElement,
    key: string,
    type: 'title'
  ): Promise<void> {
      this.isTitleTyping = true;

    try {
      const translatedText: string = await firstValueFrom(
        this.translate.get(key)
      );
      await this.eraseText(element);
      await this.typeText(element, translatedText);
    } catch (error) {
      console.error(
        `Erreur lors de la traduction ou de la saisie pour la clé "${key}" :`,
        error
      );
      await this.typeText(element, key); // Affiche la clé en cas d'erreur
    } finally {
      if (type === 'title') 
        this.isTitleTyping = false;
      
    }
  }

  /**
   * Définit un nouveau titre ou une nouvelle description aléatoirement et lance l'animation de saisie.
   * La méthode vérifie si une animation est déjà en cours pour éviter les chevauchements.
   */
  private async setRandomTitleAndDescription(): Promise<void> {
    if (this.isTitleTyping ) {
      return;
    }

    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * this.titleList.length);
    } while (randomIndex === this.lastRandomIndex);

    this.lastRandomIndex = randomIndex;

    const updateTitle: boolean = Math.random() < 0.5;

    if (updateTitle) {
      this.titleKey = this.titleList[randomIndex];
      await this.triggerTyping(
        this.titleEl.nativeElement,
        this.titleKey,
        'title'
      );
    } 
  }

  /**
   * Anime la suppression du texte caractère par caractère pour un élément HTML.
   * @param element L'élément HTML à vider.
   */
  private async eraseText(element: HTMLElement): Promise<void> {
    const cursor: HTMLElement | null = element.querySelector('.cursor');
    let node: ChildNode | null = cursor ? cursor.previousSibling : element.lastChild;
    while (node) {
      const prev: ChildNode | null = node.previousSibling;
      element.removeChild(node);
      const delay: number = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
      await new Promise((resolve) => setTimeout(resolve, delay));
      node = prev;
    }
    if (cursor && !element.contains(cursor)) {
      element.appendChild(cursor);
    }
  }

  /**
   * Anime la saisie de texte caractère par caractère dans un élément HTML.
   * Gère la suppression du contenu existant et l'ajout du curseur.
   * @param element L'élément HTML cible.
   * @param text Le texte à taper.
   */
  private async typeText(element: HTMLElement, text: string): Promise<void> {
    let cursor: HTMLElement | null = element.querySelector('.cursor');
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.classList.add('cursor');
      cursor.innerText = '';
    }

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    element.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      const char: Text = document.createTextNode(text[i]);
      element.insertBefore(char, cursor);
      const delay: number = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  private translateProjects() {
    this.projects = this.rawProjects.map(p => ({
      ...p,
      title: this.langService.translateContent(p.title),
      description: this.langService.translateContent(p.description),
      content: this.langService.translateContent(p.content),
      longDescription: this.langService.translateContent(p.longDescription || ''),
    }));
  }

  private translateSkills() {
    this.skills = this.rawSkills.map(s => ({
      ...s,
      name: s.name,
      content: this.langService.translateContent(s.content),
    }));
  }

  private translateAll() {
    this.translateProjects();
    this.translateSkills();
  }

  goToSkill(){
    console.log('Navigating to skills page', this.currentLang);
    this.router.navigate(['/', this.currentLang,'skills']); 
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
