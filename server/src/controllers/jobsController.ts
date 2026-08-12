import { Request, Response, NextFunction } from "express";
import { runQuery } from "../db";

export const getJobs = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobs = await runQuery(
      `MATCH (j:Job)
       RETURN
         j.id AS id,
         j.title AS title,
         j.company AS company,
         j.location AS location
       ORDER BY j.title`,
    );

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

export const getJobSkills = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const skills = await runQuery(
      `MATCH (j:Job {id: $jobId})-[r:REQUIRES]->(s:Skill)
       RETURN
         s.id AS skillId,
         s.name AS name,
         r.importance AS importance
       ORDER BY r.importance DESC`,
      { jobId: req.params.jobId },
    );

    res.json(skills);
  } catch (error) {
    next(error);
  }
};
