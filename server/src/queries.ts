import { runQuery } from "./db";

export interface Person {
  id: string;
  name: string;
  headline: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

export interface PersonSkill {
  skillId: string;
  name: string;
  level: number;
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


export const getPeople = () =>
  runQuery<Person>(
    `MATCH (p:Person)
     RETURN
       p.id AS id,
       p.name AS name,
       p.headline AS headline
     ORDER BY p.name`,
  );


export const getJobs = () =>
  runQuery<Job>(
    `MATCH (j:Job)
     RETURN
       j.id AS id,
       j.title AS title,
       j.company AS company,
       j.location AS location
     ORDER BY j.title`,
  );


export const getPersonSkills = (personId: string) =>
  runQuery<PersonSkill>(
    `MATCH (p:Person {id: $personId})-[r:HAS_SKILL]->(s:Skill)
     RETURN
       s.id AS skillId,
       s.name AS name,
       r.level AS level
     ORDER BY r.level DESC`,
    { personId },
  );


export const getJobSkills = (jobId: string) =>
  runQuery<JobSkill>(
    `MATCH (j:Job {id: $jobId})-[r:REQUIRES]->(s:Skill)
     RETURN
       s.id AS skillId,
       s.name AS name,
       r.importance AS importance
     ORDER BY r.importance DESC`,
    { jobId },
  );


export const getMatchesForPerson = (personId: string) =>
  runQuery<JobMatch>(
    `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(known:Skill)
     OPTIONAL MATCH (known)-[:RELATED_TO*1..2]-(adjacent:Skill)
     WITH p, collect(DISTINCT known) + collect(DISTINCT adjacent) AS reachable
     UNWIND reachable AS reachableSkill
     WITH p, collect(DISTINCT reachableSkill.id) AS reachableIds
     MATCH (j:Job)-[:REQUIRES]->(required:Skill)
     WITH j, reachableIds, collect(DISTINCT required) AS allRequired
     WHERE any(s IN allRequired WHERE s.id IN reachableIds)
     RETURN
       j.id AS jobId,
       j.title AS title,
       j.company AS company,
       j.location AS location,
       [s IN allRequired WHERE s.id IN reachableIds | s.name] AS matchedSkills,
       [s IN allRequired WHERE NOT s.id IN reachableIds | s.name] AS missingSkills,
       round(
         100.0 *
         size([s IN allRequired WHERE s.id IN reachableIds]) /
         size(allRequired)
       ) AS matchPercent
     ORDER BY matchPercent DESC, j.title ASC`,
    { personId },
  );


export const getCandidatesForJob = (jobId: string) =>
  runQuery<CandidateMatch>(
    `MATCH (j:Job {id: $jobId})-[:REQUIRES]->(required:Skill)
     WITH j, collect(DISTINCT required) AS allRequired
     MATCH (p:Person)
     OPTIONAL MATCH (p)-[:HAS_SKILL]->(known:Skill)
     OPTIONAL MATCH (known)-[:RELATED_TO*1..2]-(adjacent:Skill)
     WITH
       p,
       allRequired,
       collect(DISTINCT known) + collect(DISTINCT adjacent) AS reachable
     UNWIND
       CASE
         WHEN size(reachable) = 0 THEN [null]
         ELSE reachable
       END AS reachableSkill
     WITH
       p,
       allRequired,
       collect(DISTINCT reachableSkill.id) AS reachableIds
     WHERE any(s IN allRequired WHERE s.id IN reachableIds)
     RETURN
       p.id AS personId,
       p.name AS name,
       p.headline AS headline,
       [s IN allRequired WHERE s.id IN reachableIds | s.name] AS matchedSkills,
       [s IN allRequired WHERE NOT s.id IN reachableIds | s.name] AS missingSkills,
       round(
         100.0 *
         size([s IN allRequired WHERE s.id IN reachableIds]) /
         size(allRequired)
       ) AS matchPercent
     ORDER BY matchPercent DESC, p.name ASC`,
    { jobId },
  );


export const getRelatedSkills = (skillId: string) =>
  runQuery<RelatedSkill>(
    `MATCH path = (s:Skill {id: $skillId})-[:RELATED_TO*1..2]-(related:Skill)
     WITH
       related,
       min(length(path)) AS hops,
       max([r IN relationships(path) | r.weight][0]) AS weight
     RETURN
       related.id AS skillId,
       related.name AS name,
       hops,
       weight
     ORDER BY hops ASC, weight DESC`,
    { skillId },
  );


export const getSkillGraph = () =>
  runQuery<{ id: string; name: string; category: string }>(
    `MATCH (s:Skill)
     RETURN
       s.id AS id,
       s.name AS name,
       s.category AS category`,
  );


export const getSkillEdges = () =>
  runQuery<{ source: string; target: string; weight: number }>(
    `MATCH (a:Skill)-[r:RELATED_TO]-(b:Skill)
     WHERE a.id < b.id
     RETURN
       a.id AS source,
       b.id AS target,
       r.weight AS weight`,
  );