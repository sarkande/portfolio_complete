import { SkillModel } from "./skill-model";

export interface ParsedSkill extends SkillModel {
  contentFr: string;
  contentEn: string;
  descriptionFr: string;
  descriptionEn: string;
  longDescriptionFr: string;
  longDescriptionEn: string;
}
