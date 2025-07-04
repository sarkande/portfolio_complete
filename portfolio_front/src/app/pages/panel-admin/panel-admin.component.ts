// src/app/panel-admin/panel-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../interfaces/project.model';
import { ProjectService } from '../../services/project.service';
import { FormsModule } from '@angular/forms';
import { ParsedProject } from '../../interfaces/parsed-project';
import { Notification } from '../../interfaces/notification';
import { SkillModel } from '../../interfaces/skill-model';
import { ParsedSkill } from '../../interfaces/parsed-skill';
import { SkillService } from '../../services/skill.service';


@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule
  ],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.scss']
})
export class PanelAdminComponent implements OnInit {
  projects: ParsedProject[] = [];
  skills: ParsedSkill[] = [];

  /** Stocke la valeur de l'input d'ajout de compétence par projet */
  projectSkillInputs: { [slug: string]: string } = {};

  newProject: ParsedProject = this.getEmptyProject();
  newSkill: ParsedSkill = this.getEmptySkill();

  notifications: Notification[] = [];
  private nextId = 0;
  quickCreate = false;
  quickCreateSkill = false;

  selectedProject?: ParsedProject;
  newProjectSkill: { name: string; level: number } = { name: '', level: 1 };

  constructor(private projectService: ProjectService, private skillService: SkillService) { }

  ngOnInit() {
    this.loadProjects();
    this.loadSkills();
  }



  // ------------- Projects ------------- //
  openQuickCreate() {
    this.quickCreate = true;
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: projects => {
        this.projects = projects.map(p => this.parseProject(p));
        // Initialise les champs d'ajout de compétence
        this.projects.forEach(p => this.projectSkillInputs[p.slug] = '');
      },
      error: err => {
        console.error('Error loading projects:', err);
      }
    });
  }

  exportProjects() {
    //exporte les projets au format JSON
    //exclude property id, slug and the str fields
    const projectsToExport = this.projects.map(p => ({
      title: p.title,
      description: p.description,
      content: p.content,
      startDate: p.startDate,
      endDate: p.endDate,
      technologies: p.technologies,
      tags: p.tags,
      category: p.category,
      thumbnailUrl: p.thumbnailUrl,
      gallery: p.gallery,
      gitUrl: p.gitUrl,
      liveUrl: p.liveUrl,
      role: p.role,
      isFeatured: p.isFeatured,
      active: p.active,
      old: p.old,
      longDescription: p.longDescription
    }));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projectsToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'projects.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  /**  
   * Tente de JSON.parse la valeur, 
   * et retourne toujours un objet {fr, en} avec fallback.
   */
  private safeParse(value: any): { fr: string; en: string } {
    if (typeof value !== 'string') {
      // si ce n’est pas une chaîne, on le cast en chaîne
      const str = String(value);
      return { fr: str, en: str };
    }
    try {
      const obj = JSON.parse(value);
      const fr = typeof obj.fr === 'string' ? obj.fr : (typeof obj.en === 'string' ? obj.en : value);
      const en = typeof obj.en === 'string' ? obj.en : (typeof obj.fr === 'string' ? obj.fr : value);
      return { fr, en };
    } catch {
      // pas un JSON valide → on renvoie la même chaîne pour fr & en
      return { fr: value, en: value };
    }
  }

  /** Convertit un ProjectModel en ParsedProject en extrayant les champs fr/en */
  private parseProject(p: ProjectModel): ParsedProject {
    const title = this.safeParse(p.title);
    const desc = this.safeParse(p.description);
    const cont = this.safeParse(p.content);
    const longDescription = this.safeParse(p.longDescription || '');
    return {
      ...p,
      titleFr: title.fr,
      titleEn: title.en,
      descriptionFr: desc.fr,
      descriptionEn: desc.en,
      contentFr: cont.fr,
      contentEn: cont.en,
      technologiesStr: p.technologies?.join(', ') ?? '',
      tagsStr: p.tags?.join(', ') ?? '',
      galleryStr: p.gallery?.join('; ') ?? '',
      longDescriptionFr: longDescription.fr,
      longDescriptionEn: longDescription.en
    };
  }

  /** Convertit un SkillModel en ParsedSkill en extrayant les champs fr/en */
  private parseSkill(s: SkillModel): ParsedSkill {
    const cont = this.safeParse(s.content);
    return {
      ...s,
      contentFr: cont.fr,
      contentEn: cont.en
    };
  }
  editProject(project: ParsedProject) {
    // Re-conversion des champs string -> tableau
    project.technologies = (project.technologiesStr || '').split(',').map(t => t.trim()).filter(Boolean);
    project.tags = (project.tagsStr || '').split(',').map(t => t.trim()).filter(Boolean);
    project.gallery = (project.galleryStr || '').split(';').map(t => t.trim()).filter(Boolean);

    // Recombine les champs JSON multilingues
    project.title = JSON.stringify({ fr: project.titleFr, en: project.titleEn });
    project.description = JSON.stringify({ fr: project.descriptionFr, en: project.descriptionEn });
    project.content = JSON.stringify({ fr: project.contentFr, en: project.contentEn });

    project.longDescription = JSON.stringify({ fr: project.longDescriptionFr, en: project.longDescriptionEn });

    console.log('Projet prêt à envoyer :', project);

    // Conversion finale pour l'envoi, on utilise l'interface ProjectModel
    const projectToSend: ProjectModel = {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      technologies: project.technologies || [],
      tags: project.tags || [],
      category: project.category,
      thumbnailUrl: project.thumbnailUrl,
      gallery: project.gallery || [],
      gitUrl: project.gitUrl,
      liveUrl: project.liveUrl,
      role: project.role || '',
      isFeatured: project.isFeatured || false,
      active: project.active,
      content: project.content,
      old: project.old,
      longDescription:project.longDescription  
    };
    console.log('Projet à envoyer e:', projectToSend);
    this.projectService.updateProject(project.slug, projectToSend).subscribe({
      next: (response) => {
        console.log('Projet créé avec succès:', response);
        // Met à jour la liste des projets après la création
        // this.loadProjects();
        this.setNotification('Projet mis à jour avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la création du projet:', error);
        this.setNotification('Erreur lors de la création du projet', 'error');
      }
    });
  }

  setNotification(msg: string, type: 'success' | 'error' = 'success') {
    const id = this.nextId++;
    this.notifications.push({ id, message: msg, type });

    setTimeout(() => {
      // supprime la notification expirée
      this.notifications = this.notifications.filter(n => n.id !== id);
    }, 10000); // 10 secondes
  }

  deleteProject(project: ParsedProject) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.titleFr}" ?`)) {
      this.projectService.deleteProject(project.slug).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.id !== project.id);
          console.log(`Projet "${project.titleFr}" supprimé avec succès.`);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du projet:', error);
        }
      });
    }
  }

  createProject() {
    let projectToCreate: ProjectModel;

    projectToCreate = {
      slug: this.newProject.slug,
      title: JSON.stringify({ fr: this.newProject.titleFr, en: this.newProject.titleEn }),
      description: JSON.stringify({ fr: this.newProject.descriptionFr, en: this.newProject.descriptionEn }),
      content: JSON.stringify({ fr: this.newProject.contentFr, en: this.newProject.contentEn }),
      startDate: this.newProject.startDate,
      endDate: this.newProject.endDate,
      technologies: this.newProject.technologies || [],
      tags: this.newProject.tags || [],
      category: this.newProject.category,
      thumbnailUrl: this.newProject.thumbnailUrl,
      gallery: this.newProject.gallery || [],
      gitUrl: this.newProject.gitUrl,
      liveUrl: this.newProject.liveUrl,
      role: this.newProject.role || '',
      isFeatured: this.newProject.isFeatured || false,
      active: true,
      old: this.newProject.old,
      longDescription: this.newProject.longDescription || '',
    };
    console.log('Projet à créer:', projectToCreate);

    this.projectService.createProject(projectToCreate).subscribe({
      next: (response) => {
        console.log('Projet créé avec succès:', response);
        // Réinitialise le formulaire après la création
        this.newProject = this.getEmptyProject();
        this.quickCreate = false; // Ferme le formulaire de création rapide
        // Recharge la liste des projets
        this.loadProjects();
      },
      error: (error) => {
        console.error('Erreur lors de la création du projet:', error);
      }
    });
  }

  private getEmptyProject(): ParsedProject {
    return {
      id: 0,
      slug: '',
      title: '',
      description: '',
      content: '',
      startDate: '',
      endDate: '',
      technologies: [],
      tags: [],
      category: '',
      thumbnailUrl: '',
      gallery: [],
      gitUrl: '',
      liveUrl: '',
      role: '',
      isFeatured: false,
      active: true,
      old: false,
      longDescription: '',
      titleFr: '',
      titleEn: '',
      descriptionFr: '',
      descriptionEn: '',
      contentFr: '',
      contentEn: '',
      technologiesStr: '',
      tagsStr: '',
      galleryStr: '',
      longDescriptionFr: '',
      longDescriptionEn: '',
    };
  }

  // ------------- Skills ------------- //
  openQuickCreateSkill() {
    this.quickCreateSkill = true;
  }

  loadSkills() {
    this.skillService.getSkills().subscribe({
      next: skills => {
        this.skills = skills.map(s => this.parseSkill(s));
      },
      error: err => {
        console.error('Error loading skills:', err);
      }
    });
  }

  /** Retourne les compétences non encore associées au projet */
  availableSkills(project: ParsedProject): ParsedSkill[] {
    return this.skills.filter(s => !project.skills?.some(ps => ps.id === s.id));
  }

  addSkillToProject(project: ParsedProject, skillName: string) {
    const skill = this.skills.find(s => s.name === skillName);
    if (!skill) {
      return;
    }
    this.projectService.addSkill(project.slug, skill).subscribe({
      next: updated => {
        project.skills = updated.skills;
        this.projectSkillInputs[project.slug] = '';
      },
      error: err => console.error('Erreur lors de l\'ajout de la compétence', err)
    });
  }

  removeSkillFromProject(project: ParsedProject, skill: SkillModel) {
    if (!skill.id) return;
    this.projectService.removeSkill(project.slug, skill.id).subscribe({
      next: updated => {
        project.skills = updated.skills;
      },
      error: err => console.error('Erreur lors de la suppression de la compétence', err)
    });
  }

  createSkill() {
    const skillToCreate: SkillModel = {
      name: this.newSkill.name,
      level: this.newSkill.level,
      content: JSON.stringify({ fr: this.newSkill.contentFr, en: this.newSkill.contentEn }),
      icon: this.newSkill.icon || ''
    };
    console.log('Compétence à créer:', skillToCreate);

    this.skillService.createSkill(skillToCreate).subscribe({
      next: (response) => {
        console.log('Compétence créée avec succès:', response);
        // Réinitialise le formulaire après la création
        this.newSkill = this.getEmptySkill();
        this.quickCreateSkill = false; // Ferme le formulaire de création rapide
        // Recharge la liste des compétences
        this.loadSkills();
      },
      error: (error) => {
        console.error('Erreur lors de la création de la compétence:', error);
      }
    });
  }

  editSkill(skill: ParsedSkill) {
    if (!skill.id )
      return
    const skillToUpdate: SkillModel = {
      id: skill.id,
      name: skill.name,
      level: skill.level,
      icon: skill.icon,
      content: JSON.stringify({ fr: skill.contentFr, en: skill.contentEn })
    };
    console.log('Compétence à mettre à jour:', skillToUpdate);

    this.skillService.updateSkill(skill.id, skillToUpdate).subscribe({
      next: (response) => {
        console.log('Compétence mise à jour avec succès:', response);
        // Recharge la liste des compétences
        this.loadSkills();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la compétence:', error);
      }
    });
  }

  deleteSkill(skill: ParsedSkill) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la compétence "${skill.name}" ?`)) {
      this.skillService.deleteSkill(skill.name).subscribe({
        next: () => {
          this.skills = this.skills.filter(s => s.id !== skill.id);
          console.log(`Compétence "${skill.name}" supprimée avec succès.`);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la compétence:', error);
        }
      });
    }
  }

  private getEmptySkill(): ParsedSkill {
    return {
      id: 0,
      name: '',
      level: 1,
      content: '',
      contentFr: '',
      contentEn: '',
      icon: '',
    };
  }
  exportSkills() {
    // Exporte les compétences au format JSON
    const skillsToExport = this.skills.map(s => ({
      name: s.name,
      level: s.level,
      content: s.content,
      icon: s.icon,
    }));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(skillsToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'skills.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
}