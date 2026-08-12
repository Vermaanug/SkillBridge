import { Router } from "express";
import {
  getJobs,
  getJobSkills,
} from "../controllers/jobsController";
import { getCandidatesForJob } from "../controllers/matchesController";


export const jobRouter = Router();


jobRouter.get("/", getJobs);

jobRouter.get("/:jobId/skills", getJobSkills);

jobRouter.get("/:jobId/candidates", getCandidatesForJob);