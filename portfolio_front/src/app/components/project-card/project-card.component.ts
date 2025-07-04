import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../interfaces/project.model';
import { IconPipe } from '../../pipes/icon.pipe';
import {  RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, IconPipe, RouterModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input() project!: ProjectModel;


}
