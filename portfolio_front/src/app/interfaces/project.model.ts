import { SkillModel } from "./skill-model";

export interface ProjectModel {
	id?: number;
	slug: string;
	title: string;
	description: string;
	startDate: string; // Format ISO: 'YYYY-MM-DD'
	endDate?: string | null;
	technologies: string[];
	skills?: SkillModel[];
	tags: string[];
	category: 'Personnel' | 'Formation' | 'Professionnel' | 'Hackathon' | string;
	thumbnailUrl: string;
	gallery: string[];
	gitUrl?: string | null;
	liveUrl?: string | null;
	role: string;
	isFeatured: boolean;
	active: boolean;
	old: boolean;
	content: string;
	longDescription: string; 
}
