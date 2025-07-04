import { SkillModel } from "./skill-model";

export interface SkillWithProjects extends SkillModel {
    projects?: Array<{
        title: string;
        slug: string;
      }>;
}
