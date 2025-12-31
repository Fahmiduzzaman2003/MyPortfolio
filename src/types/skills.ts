// types/skills.ts
export interface Skill {
  id: number;
  name: string;
  level: number;
  category_id?: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  icon?: string;
  logo_url?: string;
  display_order?: number;
  skills: Skill[];
}