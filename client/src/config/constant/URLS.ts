const URLS = {
  HEALTH: "/api/health",
  PEOPLE: "/api/people",
  JOBS: "/api/jobs",

  PERSON_SKILLS: (id: string) => `/api/people/${id}/skills`,
  JOB_SKILLS: (id: string) => `/api/jobs/${id}/skills`,

  PERSON_MATCHES: (id: string) => `/api/people/${id}/matches`,
  JOB_CANDIDATES: (id: string) => `/api/jobs/${id}/candidates`,

  SKILL_RELATED: (id: string) => `/api/skills/${id}/related`,
  SKILL_GRAPH: "/api/skills/graph",
};

export default URLS;