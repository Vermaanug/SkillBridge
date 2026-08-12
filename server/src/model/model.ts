export interface Person {
  id: string;
  name: string;
  headline: string;
}


export interface PersonSkill {
  skillId: string;
  name: string;
  level: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}


export interface JobSkill {
  skillId: string;
  name: string;
  importance: number;
}

export interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercent: number;
}


export interface CandidateMatch {
  personId: string;
  name: string;
  headline: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercent: number;
}

export interface RelatedSkill {
  skillId: string;
  name: string;
  hops: number;
  weight: number;
}


export interface Skill {
  id: string;
  name: string;
  category: string;
}


export interface SkillEdge {
  source: string;
  target: string;
  weight: number;
}