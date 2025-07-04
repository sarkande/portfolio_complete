import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
} from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { of, Subject, throwError, Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ElementRef } from '@angular/core';

// Un chargeur de traduction factice qui fournit des traductions mockées de manière synchrone.
// Cela permet au TranslatePipe de fonctionner dans les tests sans charger de fichiers réels.
class CustomTranslateLoader implements TranslateLoader {
  private translations: { [key: string]: string } = {
    'home.title1': 'Mock Title 1',
    'home.title2': 'Mock Title 2',
    'home.title3': 'Mock Title 3',
    'home.title4': 'Mock Title 4',
    'home.title5': 'Mock Title 5',
    'home.title6': 'Mock Title 6',
    'home.title7': 'Mock Title 7',
    'home.title8': 'Mock Title 8',
    'home.title9': 'Mock Title 9',
    'home.title10': 'Mock Title 10',
    'home.description1': 'Mock Description 1',
    'home.description2': 'Mock Description 2',
    'home.description3': 'Mock Description 3',
    'home.description4': 'Mock Description 4',
    'home.description5': 'Mock Description 5',
    'home.description6': 'Mock Description 6',
    'home.description7': 'Mock Description 7',
    'home.description8': 'Mock Description 8',
    'home.description9': 'Mock Description 9',
    'home.description10': 'Mock Description 10',
    resume: 'Mock Resume',
    projects: 'Mock Projects',
    about: 'Mock About',
  };

  getTranslation(lang: string): Observable<any> {
    // Retourne un Observable du mock de traduction.
    // Simule que la traduction est disponible immédiatement.
    return of(this.translations);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let translateService: TranslateService; // Référence à l'instance réelle de TranslateService
  let languageServiceSpy: jasmine.SpyObj<LanguageService>; // Espion pour LanguageService

  // Subjects pour simuler les Observables utilisés par les services
  let currentLangSubject: Subject<string>;

  beforeEach(async () => {
    currentLangSubject = new Subject<string>();

    // Crée un espion pour LanguageService
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [], {
      currentLang$: currentLangSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule, // Fournit les dépendances pour le routage
        // Configure TranslateModule avec notre CustomTranslateLoader.
        // Cela fournit toutes les dépendances internes de ngx-translate (y compris TranslateStore)
        // et permet au TranslatePipe de fonctionner normalement dans le template.
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: CustomTranslateLoader },
        }),
      ],
      providers: [
        // Fournit notre espion pour LanguageService.
        { provide: LanguageService, useValue: languageServiceSpy },
        // IMPORTANT: Nous ne fournissons PAS TranslateService ici car il est déjà fourni par
        // TranslateModule.forRoot(). Nous allons simplement le récupérer et l'espionner ensuite.
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Obtenez l'instance réelle de TranslateService injectée par TestBed.
    translateService = TestBed.inject(TranslateService);

    // Espionnez la méthode 'get' du VRAI TranslateService.
    // Cela nous permet de vérifier les appels sans perturber son fonctionnement interne
    // ni les dépendances du TranslatePipe.
    spyOn(translateService, 'get').and.callThrough();

    // S'assure que le currentLang$ du LanguageService commence avec une valeur.
    // Cela déclenche la souscription dans le constructeur du composant.
    currentLangSubject.next('fr');

    // Le TranslatePipe et les appels à translateService.get() devraient maintenant fonctionner.
    fixture.detectChanges(); // Déclenche la détection de changements pour initialiser @ViewChild et ngAfterViewInit
  });

  // Nettoyage après chaque test pour éviter les interférences, surtout avec setInterval
  afterEach(() => {
    fixture.destroy(); // Appelle ngOnDestroy du composant pour nettoyer les souscriptions/timers
  });

  // --- Tests d'initialisation du composant ---
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize titleList and descriptionList dynamically', () => {
    expect(component.titleList.length).toBe(10);
    expect(component.descriptionList.length).toBe(10);
    expect(component.titleList[0]).toBe('home.title1');
    expect(component.titleList[9]).toBe('home.title10');
    expect(component.descriptionList[0]).toBe('home.description1');
    expect(component.descriptionList[9]).toBe('home.description10');
  });

  it('should subscribe to LanguageService.currentLang$ and update currentLang', fakeAsync(() => {
    expect(component.currentLang).toBe('fr');

    currentLangSubject.next('en');
    tick(); // Avance le temps pour la résolution de l'observable
    expect(component.currentLang).toBe('en');

    currentLangSubject.next('es');
    tick();
    expect(component.currentLang).toBe('es');
    flush(); // S'assure que tous les timers/promesses sont terminés
  }));

  // --- Tests du cycle de vie ngAfterViewInit ---


  // --- Tests de la méthode triggerTyping ---
  describe('triggerTyping', () => {
    let mockElement: HTMLElement;
    let spyOnTypeText: jasmine.Spy;
    let spyOnEraseText: jasmine.Spy;

    beforeEach(() => {
      mockElement = document.createElement('div');
      spyOnTypeText = spyOn(component as any, 'typeText').and.resolveTo(undefined);
      spyOnEraseText = spyOn(component as any, 'eraseText').and.resolveTo(undefined);
      (translateService.get as jasmine.Spy).calls.reset(); // Réinitialise l'espion du service réel
      spyOnTypeText.calls.reset();
      spyOnEraseText.calls.reset();
    });

    it('should set isTitleTyping to true before typing title and false after', fakeAsync(() => {
      (translateService.get as jasmine.Spy).and.returnValue(of('Mocked Title'));
      component['triggerTyping'](mockElement, 'home.title1', 'title');
      expect(component.isTitleTyping).toBeTrue();
      tick(); // Avance le temps pour la résolution de typeText
      expect(component.isTitleTyping).toBeFalse();
      expect(component.isDescriptionTyping).toBeFalse();
      flush();
    }));

    it('should set isDescriptionTyping to true before typing description and false after', fakeAsync(() => {
      (translateService.get as jasmine.Spy).and.returnValue(
        of('Mocked Description')
      );
      component['triggerTyping'](
        mockElement,
        'home.description1',
        'description'
      );
      expect(component.isDescriptionTyping).toBeTrue();
      tick();
      expect(component.isDescriptionTyping).toBeFalse(); // Devrait maintenant être false après tick() et résolution
      flush();
    }));

    it('should call eraseText then typeText with the translated text', fakeAsync(() => {
      const translatedText = 'Ceci est un titre traduit';
      (translateService.get as jasmine.Spy).and.returnValue(of(translatedText));

      component['triggerTyping'](mockElement, 'home.titleKey', 'title');
      tick(); // Avance le temps pour la promesse de get()
      flush();

      expect(spyOnEraseText).toHaveBeenCalledBefore(spyOnTypeText);
      expect(spyOnTypeText).toHaveBeenCalledWith(mockElement, translatedText);
    }));

    it('should call typeText with the key if translation fails', fakeAsync(() => {
      // Configure l'espion du vrai service pour renvoyer une erreur
      (translateService.get as jasmine.Spy).and.returnValue(
        throwError(() => new Error('Translation failed'))
      );
      spyOn(console, 'error'); // Espionne console.error

      component['triggerTyping'](mockElement, 'home.invalidKey', 'title');
      flush(); // Flushera le microtask de l'erreur

      expect(console.error).toHaveBeenCalled();
      expect(spyOnEraseText).toHaveBeenCalled();
      expect(spyOnTypeText).toHaveBeenCalledWith(
        mockElement,
        'home.invalidKey'
      );
    }));
  });

  // --- Tests de la méthode setRandomTitleAndDescription ---
  describe('setRandomTitleAndDescription', () => {
    let spyOnTriggerTyping: jasmine.Spy;

    beforeEach(() => {
      spyOnTriggerTyping = spyOn(
        component as any,
        'triggerTyping'
      ).and.resolveTo(undefined);
      component.isTitleTyping = false;
      component.isDescriptionTyping = false;
      component.titleList = ['t1', 't2']; // Simplifié pour les tests
      component.descriptionList = ['d1', 'd2']; // Simplifié pour les tests
      component.lastRandomIndex = null;
    });

    it('should return if isTitleTyping is true', fakeAsync(() => {
      component.isTitleTyping = true;
      component['setRandomTitleAndDescription']();
      tick();
      expect(spyOnTriggerTyping).not.toHaveBeenCalled();
      flush();
    }));

    it('should return if isDescriptionTyping is true', fakeAsync(() => {
      component.isDescriptionTyping = true;
      component['setRandomTitleAndDescription']();
      tick();
      expect(spyOnTriggerTyping).not.toHaveBeenCalled();
      flush();
    }));

    it('should call triggerTyping for title or description', fakeAsync(() => {
      // Mock ViewChild elements, car ils peuvent être null avant fixture.detectChanges()
      component.titleEl = {
        nativeElement: document.createElement('h2'),
      } as ElementRef<HTMLElement>;
      component.descEl = {
        nativeElement: document.createElement('h3'),
      } as ElementRef<HTMLElement>;

      spyOn(Math, 'random').and.returnValue(0.4); // Forcer la mise à jour du titre
      component['setRandomTitleAndDescription']();
      tick();
      expect(spyOnTriggerTyping).toHaveBeenCalledWith(
        component.titleEl.nativeElement,
        jasmine.stringMatching(/t[12]/),
        'title'
      );
      flush();

      spyOnTriggerTyping.calls.reset();
      (Math.random as jasmine.Spy).and.returnValue(0.6); // Forcer la mise à jour de la description
      component['setRandomTitleAndDescription']();
      tick();
      expect(spyOnTriggerTyping).toHaveBeenCalledWith(
        component.descEl.nativeElement,
        jasmine.stringMatching(/d[12]/),
        'description'
      );
      flush();
    }));

    it('should update lastRandomIndex and avoid immediate repetition', fakeAsync(() => {
      component.titleEl = {
        nativeElement: document.createElement('h2'),
      } as ElementRef<HTMLElement>;
      component.descEl = {
        nativeElement: document.createElement('h3'),
      } as ElementRef<HTMLElement>;

      component.lastRandomIndex = 0;
      spyOn(Math, 'random').and.returnValues(
        0.4,
        0.0, // force re-roll if lastRandomIndex is 0
        0.8,
        0.6,
        0.0
      );

      component['setRandomTitleAndDescription']();
      tick();
      flush();
      expect(component.lastRandomIndex).toBe(1);

      component['setRandomTitleAndDescription']();
      tick();
      flush();
      expect(component.lastRandomIndex).toBe(0);
    }));
  });

  // --- Tests de la méthode typeText ---
  describe('typeText', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      const existingCursor = document.createElement('span');
      existingCursor.classList.add('cursor');
      mockElement.appendChild(existingCursor);
    });

    it('should clear existing content except the cursor', fakeAsync(() => {
      mockElement.innerHTML = 'Old text<span class="cursor">|</span>';
      component['typeText'](mockElement, 'New Text');
      tick(100);
      expect(mockElement.textContent).not.toContain('Old text');
      expect(
        (mockElement.lastChild as HTMLElement).classList.contains('cursor')
      ).toBeTrue();
      flush();
    }));

    it('should create a cursor if none exists', fakeAsync(() => {
      mockElement.innerHTML = '';
      component['typeText'](mockElement, 'Hello');
      tick(100);
      expect(mockElement.querySelector('.cursor')).toBeTruthy();
      expect(mockElement.querySelector('.cursor')?.textContent).toBe('|');
      flush();
    }));

    it('should append the cursor to the element if it exists', fakeAsync(() => {
      const existingCursor = document.createElement('span');
      existingCursor.classList.add('cursor');
      mockElement.innerHTML = 'Some text';
      mockElement.appendChild(existingCursor);

      component['typeText'](mockElement, 'Test');
      tick(100);
      expect(
        (mockElement.lastChild as HTMLElement).classList.contains('cursor')
      ).toBeTrue();
      flush();
    }));

  });

  // --- Tests de la méthode eraseText ---
  describe('eraseText', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      mockElement.innerHTML = 'Hello<span class="cursor">|</span>';
    });

    it('should remove all characters and keep the cursor', fakeAsync(() => {
      component['eraseText'](mockElement);
      tick(100);
      flush();
      expect(mockElement.textContent).toBe('|');
      expect(mockElement.querySelector('.cursor')).toBeTruthy();
    }));
  });
});
