// Realistic, small seed dataset for SkillBridge.
// Kept intentionally compact — a few dozen nodes/edges is enough to make
// every query in queries.ts return interesting, non-trivial results.

export const skills = [
  { id: "sk-js", name: "JavaScript", category: "Language" },
  { id: "sk-ts", name: "TypeScript", category: "Language" },
  { id: "sk-react", name: "React", category: "Framework" },
  { id: "sk-node", name: "Node.js", category: "Runtime" },
  { id: "sk-sql", name: "SQL", category: "Data" },
  { id: "sk-python", name: "Python", category: "Language" },
  { id: "sk-data", name: "Data Analysis", category: "Data" },
  { id: "sk-sysdesign", name: "System Design", category: "Architecture" },
  { id: "sk-docker", name: "Docker", category: "Infra" },
  { id: "sk-graphql", name: "GraphQL", category: "API" },
  { id: "sk-uidesign", name: "UI Design", category: "Design" },
  { id: "sk-comms", name: "Communication", category: "Soft Skill" },
];

export const jobs = [
  {
    id: "job-fe-nimbus",
    title: "Frontend Engineer",
    company: "Nimbus Labs",
    location: "Remote",
    description: "Build customer-facing dashboards used by 40k+ daily users.",
  },
  {
    id: "job-be-nimbus",
    title: "Backend Engineer",
    company: "Nimbus Labs",
    location: "Remote",
    description:
      "Own the API layer and data services behind the Nimbus platform.",
  },
  {
    id: "job-fullstack-orbit",
    title: "Full Stack Developer",
    company: "Orbit Systems",
    location: "Bengaluru, IN",
    description: "Ship end-to-end features across a React + Node.js codebase.",
  },
  {
    id: "job-data-fernwood",
    title: "Data Analyst",
    company: "Fernwood Analytics",
    location: "Hybrid — Pune, IN",
    description:
      "Turn raw operational data into decisions for the product team.",
  },
  {
    id: "job-devops-orbit",
    title: "DevOps Engineer",
    company: "Orbit Systems",
    location: "Bengaluru, IN",
    description: "Harden deployment pipelines and container infrastructure.",
  },
  {
    id: "job-design-fernwood",
    title: "Product Designer",
    company: "Fernwood Analytics",
    location: "Remote",
    description: "Design the interfaces analysts use to explore their data.",
  },
];

export const people = [
  {
    id: "person-anurag",
    name: "Anurag Verma",
    headline: "Frontend developer, React/TypeScript",
  },
  {
    id: "person-priya",
    name: "Priya Nair",
    headline: "Analyst exploring backend fundamentals",
  },
  {
    id: "person-karan",
    name: "Karan Shah",
    headline: "Backend engineer, infra-curious",
  },
  {
    id: "person-meera",
    name: "Meera Iyer",
    headline: "Product designer with frontend chops",
  },
  {
    id: "person-devon",
    name: "Devon Clarke",
    headline: "Full stack generalist",
  },
];

export const hasSkill = [
  { personId: "person-anurag", skillId: "sk-js", level: 4 },
  { personId: "person-anurag", skillId: "sk-ts", level: 4 },
  { personId: "person-anurag", skillId: "sk-react", level: 4 },
  { personId: "person-anurag", skillId: "sk-node", level: 2 },

  { personId: "person-priya", skillId: "sk-python", level: 4 },
  { personId: "person-priya", skillId: "sk-sql", level: 3 },
  { personId: "person-priya", skillId: "sk-data", level: 3 },

  { personId: "person-karan", skillId: "sk-node", level: 4 },
  { personId: "person-karan", skillId: "sk-docker", level: 3 },
  { personId: "person-karan", skillId: "sk-sql", level: 2 },

  { personId: "person-meera", skillId: "sk-uidesign", level: 4 },
  { personId: "person-meera", skillId: "sk-comms", level: 4 },
  { personId: "person-meera", skillId: "sk-react", level: 2 },

  { personId: "person-devon", skillId: "sk-js", level: 3 },
  { personId: "person-devon", skillId: "sk-node", level: 3 },
  { personId: "person-devon", skillId: "sk-sql", level: 3 },
  { personId: "person-devon", skillId: "sk-docker", level: 2 },
];

// importance: 1 (nice-to-have) – 3 (must-have)
export const requires = [
  { jobId: "job-fe-nimbus", skillId: "sk-js", importance: 3 },
  { jobId: "job-fe-nimbus", skillId: "sk-ts", importance: 3 },
  { jobId: "job-fe-nimbus", skillId: "sk-react", importance: 3 },
  { jobId: "job-fe-nimbus", skillId: "sk-uidesign", importance: 2 },

  { jobId: "job-be-nimbus", skillId: "sk-node", importance: 3 },
  { jobId: "job-be-nimbus", skillId: "sk-sql", importance: 2 },
  { jobId: "job-be-nimbus", skillId: "sk-sysdesign", importance: 3 },
  { jobId: "job-be-nimbus", skillId: "sk-docker", importance: 2 },

  { jobId: "job-fullstack-orbit", skillId: "sk-js", importance: 3 },
  { jobId: "job-fullstack-orbit", skillId: "sk-react", importance: 3 },
  { jobId: "job-fullstack-orbit", skillId: "sk-node", importance: 3 },
  { jobId: "job-fullstack-orbit", skillId: "sk-sql", importance: 2 },

  { jobId: "job-data-fernwood", skillId: "sk-python", importance: 3 },
  { jobId: "job-data-fernwood", skillId: "sk-sql", importance: 3 },
  { jobId: "job-data-fernwood", skillId: "sk-data", importance: 3 },

  { jobId: "job-devops-orbit", skillId: "sk-docker", importance: 3 },
  { jobId: "job-devops-orbit", skillId: "sk-sysdesign", importance: 3 },
  { jobId: "job-devops-orbit", skillId: "sk-node", importance: 2 },

  { jobId: "job-design-fernwood", skillId: "sk-uidesign", importance: 3 },
  { jobId: "job-design-fernwood", skillId: "sk-comms", importance: 3 },
  { jobId: "job-design-fernwood", skillId: "sk-react", importance: 1 },
];

// weight: how strongly two skills co-occur / relate (0–1). Stored once per
// pair; queries traverse RELATED_TO as undirected so direction doesn't matter.
export const relatedTo = [
  { a: "sk-js", b: "sk-ts", weight: 0.9 },
  { a: "sk-js", b: "sk-react", weight: 0.85 },
  { a: "sk-ts", b: "sk-react", weight: 0.8 },
  { a: "sk-js", b: "sk-node", weight: 0.85 },
  { a: "sk-node", b: "sk-sql", weight: 0.5 },
  { a: "sk-node", b: "sk-docker", weight: 0.6 },
  { a: "sk-react", b: "sk-graphql", weight: 0.55 },
  { a: "sk-react", b: "sk-uidesign", weight: 0.5 },
  { a: "sk-python", b: "sk-data", weight: 0.8 },
  { a: "sk-python", b: "sk-sql", weight: 0.6 },
  { a: "sk-sql", b: "sk-data", weight: 0.7 },
  { a: "sk-sysdesign", b: "sk-docker", weight: 0.6 },
  { a: "sk-sysdesign", b: "sk-node", weight: 0.55 },
  { a: "sk-docker", b: "sk-graphql", weight: 0.3 },
  { a: "sk-uidesign", b: "sk-comms", weight: 0.4 },
];
