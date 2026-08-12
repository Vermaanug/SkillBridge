import { Request, Response } from "express";
import { runQuery } from "../db";
import { asyncHandler } from "../middleware/asyncHandler";
import { RelatedSkill, Skill, SkillEdge } from "../model/model";



export const getRelatedSkills = asyncHandler(
  async (req: Request, res: Response) => {
    const skills = await runQuery<RelatedSkill>(
      `MATCH path =
         (s:Skill {id: $skillId})
         -[:RELATED_TO*1..2]-
         (related:Skill)

       WITH
         related,
         min(length(path)) AS hops,
         max(
           [r IN relationships(path) | r.weight][0]
         ) AS weight

       RETURN
         related.id AS skillId,
         related.name AS name,
         hops,
         weight

       ORDER BY hops ASC, weight DESC`,
      {
        skillId: req.params.skillId,
      },
    );

    res.json(skills);
  },
);


export const getSkillGraph = asyncHandler(
  async (_req: Request, res: Response) => {
    const [nodes, edges] = await Promise.all([
      runQuery<Skill>(
        `MATCH (s:Skill)
         RETURN
           s.id AS id,
           s.name AS name,
           s.category AS category`,
      ),

      runQuery<SkillEdge>(
        `MATCH (a:Skill)-[r:RELATED_TO]-(b:Skill)
         WHERE a.id < b.id
         RETURN
           a.id AS source,
           b.id AS target,
           r.weight AS weight`,
      ),
    ]);


    res.json({
      nodes,
      edges,
    });
  },
);