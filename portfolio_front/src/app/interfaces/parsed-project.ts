import { ProjectModel } from "./project.model";

export interface ParsedProject extends ProjectModel {
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    contentFr: string;
    contentEn: string;

    technologiesStr?: string;
    tagsStr?: string;
    galleryStr?: string;

    longDescriptionFr: string;
    longDescriptionEn: string;
}
  