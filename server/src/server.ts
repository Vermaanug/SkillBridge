import "dotenv/config";
import cors from "cors";
import express from "express";

import { verifyConnection } from "./db";
import { errorHandler } from "./middleware/errorHandler";

import { peopleRouter } from "./routes/peopleRoutes";
import { jobRouter } from "./routes/jobRoutes";
import { matchRouter } from "./routes/matchRoutes";
import { skillRouter } from "./routes/skillRoutes";


const app = express();
const PORT = process.env.PORT || 4000;


app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);


app.use(express.json());


app.get("/api/health", async (_req, res) => {
  const status = await verifyConnection();

  res.status(status.ok ? 200 : 503).json(status);
});


app.use("/api/people", peopleRouter);

app.use("/api/jobs", jobRouter);

app.use("/api/matches", matchRouter);

app.use("/api/skills", skillRouter);


app.use(errorHandler);


const start = async () => {
  const health = await verifyConnection();


  if (!health.ok) {
    console.warn(
      `[server] Starting even though CognoDB is unreachable right now (${health.error}). ` +
        "Requests will return 503 until the connection is restored.",
    );
  } else {
    console.log("[server] Connected to CognoDB.");
  }


  app.listen(PORT, () => {
    console.log(
      `[server] SkillBridge API listening on http://localhost:${PORT}`,
    );
  });
};


start();