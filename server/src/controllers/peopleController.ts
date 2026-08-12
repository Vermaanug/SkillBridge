import { Request, Response, NextFunction } from "express";
import { runQuery } from "../db";


export const getPeople = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const people = await runQuery(
      `MATCH (p:Person)
       RETURN p.id AS id, p.name AS name, p.headline AS headline
       ORDER BY p.name`,
    );

    res.json(people);
  } catch (error) {
    next(error);
  }
};


export const getPersonSkills = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const skills = await runQuery(
      `MATCH (p:Person {id: $personId})-[r:HAS_SKILL]->(s:Skill)
       RETURN s.id AS skillId, s.name AS name, r.level AS level
       ORDER BY r.level DESC`,
      { personId: req.params.personId },
    );

    res.json(skills);
  } catch (error) {
    next(error);
  }
};