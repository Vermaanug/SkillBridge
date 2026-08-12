const URLS = {
  HEALTH: "/health",

  PEOPLE: "/people",
  JOBS: "/jobs",

  PERSON_SKILLS: (id: string) => `/people/${id}/skills`,
  JOB_SKILLS: (id: string) => `/jobs/${id}/skills`,

  PERSON_MATCHES: (id: string) => `/people/${id}/matches`,
  JOB_CANDIDATES: (id: string) => `/jobs/${id}/candidates`,

  SKILL_RELATED: (id: string) => `/skills/${id}/related`,
  SKILL_GRAPH: "/skills/graph",
};

export default URLS;