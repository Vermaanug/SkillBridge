import { Router } from "express";
import {
  getRelatedSkills,
  getSkillGraph,
} from "../controllers/skillsController";


export const skillRouter = Router();


skillRouter.get("/graph", getSkillGraph);

skillRouter.get("/:skillId/related", getRelatedSkills);