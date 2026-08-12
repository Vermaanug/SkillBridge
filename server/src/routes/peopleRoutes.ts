import { Router } from "express";
import {
  getPeople,
  getPersonSkills,
} from "../controllers/peopleController";
import { getMatchesForPerson } from "../controllers/matchesController";


export const peopleRouter = Router();


peopleRouter.get("/", getPeople);

peopleRouter.get("/:personId/skills", getPersonSkills);

peopleRouter.get("/:personId/matches", getMatchesForPerson);