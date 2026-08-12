import { Router } from "express";
import {
  getMatchesForPerson,
  getCandidatesForJob,
} from "../controllers/matchesController";

export const matchRouter = Router();

matchRouter.get("/people/:personId", getMatchesForPerson);

matchRouter.get("/jobs/:jobId", getCandidatesForJob);
