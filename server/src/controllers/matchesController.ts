import { Request, Response } from "express";
import { runQuery } from "../db";
import { asyncHandler } from "../middleware/asyncHandler";
import { CandidateMatch, JobMatch } from "../model/model";



export const getMatchesForPerson = asyncHandler(
  async (req: Request, res: Response) => {
    const matches = await runQuery<JobMatch>(
      `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(known:Skill)
       OPTIONAL MATCH (known)-[:RELATED_TO*1..2]-(adjacent:Skill)
       WITH
         collect(DISTINCT known) +
         collect(DISTINCT adjacent) AS reachable

       UNWIND reachable AS skill

       WITH collect(DISTINCT skill.id) AS reachableIds

       MATCH (j:Job)-[:REQUIRES]->(required:Skill)

       WITH
         j,
         reachableIds,
         collect(DISTINCT required) AS allRequired

       WHERE any(
         skill IN allRequired
         WHERE skill.id IN reachableIds
       )

       RETURN
         j.id AS jobId,
         j.title AS title,
         j.company AS company,
         j.location AS location,

         [
           skill IN allRequired
           WHERE skill.id IN reachableIds
           | skill.name
         ] AS matchedSkills,

         [
           skill IN allRequired
           WHERE NOT skill.id IN reachableIds
           | skill.name
         ] AS missingSkills,

         round(
           100.0 *
           size([
             skill IN allRequired
             WHERE skill.id IN reachableIds
           ]) /
           size(allRequired)
         ) AS matchPercent

       ORDER BY matchPercent DESC, j.title ASC`,
      {
        personId: req.params.personId,
      },
    );

    res.json(matches);
  },
);


export const getCandidatesForJob = asyncHandler(
  async (req: Request, res: Response) => {
    const candidates = await runQuery<CandidateMatch>(
      `MATCH (j:Job {id: $jobId})-[:REQUIRES]->(required:Skill)

       WITH
         collect(DISTINCT required) AS allRequired

       MATCH (p:Person)

       OPTIONAL MATCH (p)-[:HAS_SKILL]->(known:Skill)

       OPTIONAL MATCH (known)-[:RELATED_TO*1..2]-(adjacent:Skill)

       WITH
         p,
         allRequired,
         collect(DISTINCT known) +
         collect(DISTINCT adjacent) AS reachable

       UNWIND
         CASE
           WHEN size(reachable) = 0
           THEN [null]
           ELSE reachable
         END AS skill

       WITH
         p,
         allRequired,
         collect(DISTINCT skill.id) AS reachableIds

       WHERE any(
         required IN allRequired
         WHERE required.id IN reachableIds
       )

       RETURN
         p.id AS personId,
         p.name AS name,
         p.headline AS headline,

         [
           required IN allRequired
           WHERE required.id IN reachableIds
           | required.name
         ] AS matchedSkills,

         [
           required IN allRequired
           WHERE NOT required.id IN reachableIds
           | required.name
         ] AS missingSkills,

         round(
           100.0 *
           size([
             required IN allRequired
             WHERE required.id IN reachableIds
           ]) /
           size(allRequired)
         ) AS matchPercent

       ORDER BY matchPercent DESC, p.name ASC`,
      {
        jobId: req.params.jobId,
      },
    );

    res.json(candidates);
  },
);