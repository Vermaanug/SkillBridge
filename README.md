# SkillBridge

SkillBridge is a graph-backed skill matching application that answers a question a traditional resume keyword search cannot:

> **"What am I actually close to, even through skills I haven't explicitly listed?"**

Given a person, SkillBridge expands outward from their known skills through a skill-adjacency graph and surfaces jobs they partially or fully qualify for.

It also supports the reverse lookup:

> **Given a job, which people are closest to its required skill graph?**

The project is built with **React, TypeScript, TanStack Query, Express, TypeScript, and CognoDB**.

Built for the **Wexa AI CognoDB take-home assignment**.

---

## Core idea

Traditional keyword matching mostly answers:

```text
Does this person have the exact skill required by this job?
```

SkillBridge instead asks:

```text
How close is this person's skill graph
to the skill graph required by this job?
```

For example, if a person has:

```text
React
Docker
```

and a job requires:

```text
TypeScript
React
GraphQL
```

the person may still be a meaningful candidate if the skill graph connects:

```text
React
  ├── TypeScript
  └── GraphQL
```

The system can therefore identify **near matches**, not just exact keyword matches.

---

## Why a graph database?

The central problem is a variable-depth traversal across related skills.

For a person-to-job match, the conceptual traversal is:

```text
(:Person)
   │
   │ HAS_SKILL
   ▼
(:Skill)
   │
   │ RELATED_TO × 1..2
   ▼
(:Skill)
   │
   │ REQUIRES
   ▼
(:Job)
```

In a relational database, this type of operation would typically require:

- recursive CTEs to expand related skills,
- joins against a job/skill relationship table,
- grouping and aggregation to calculate coverage,
- and a similar query in the opposite direction for candidate discovery.

CognoDB makes the graph traversal the natural query operation.

The traversal depth can be changed without changing the schema.

---

# Data model

```text
 (:Person {id, name, headline})
        |
        | HAS_SKILL {level: 1-4}
        v
  (:Skill {id, name, category})
        |
        | RELATED_TO {weight: 0-1}
        |
        v
  (:Skill {id, name, category})
        ^
        |
        | REQUIRES {importance: 1-3}
        |
   (:Job {id, title, company, location, description})
```

## Person

Represents a user/person in the system.

```text
Person
├── id
├── name
└── headline
```

## Skill

Represents a normalized skill.

```text
Skill
├── id
├── name
└── category
```

## Job

Represents a job opportunity.

```text
Job
├── id
├── title
├── company
├── location
└── description
```

## Relationships

### `HAS_SKILL`

```text
Person ──HAS_SKILL──> Skill
```

Properties:

```text
level: 1-4
```

Represents the person's self-rated proficiency.

### `REQUIRES`

```text
Job ──REQUIRES──> Skill
```

Properties:

```text
importance: 1-3
```

Represents how important the skill is to the job.

### `RELATED_TO`

```text
Skill ──RELATED_TO── Skill
```

Properties:

```text
weight: 0-1
```

Represents the strength of the relationship between two skills.

This relationship is the key to SkillBridge's multi-hop matching.

---

# Matching flow

## Person → Jobs

The application starts with a person's known skills.

```text
Person's skills
      ↓
1–2 hop skill expansion
      ↓
Reachable skills
      ↓
Job requirements
      ↓
Coverage calculation
      ↓
Ranked job matches
```

This allows the application to find jobs where the person has:

- exact skill matches,
- related skill matches,
- partial coverage,
- or strong overall coverage.

## Job → Candidates

The same graph is traversed in reverse.

```text
Job requirements
      ↓
1–2 hop skill expansion
      ↓
Reachable skills
      ↓
People with those skills
      ↓
Coverage calculation
      ↓
Ranked candidates
```

This provides a candidate discovery mechanism based on skill proximity rather than exact keyword matching.

---

# API

The backend exposes a REST API under `/api`.

## Health

```http
GET /api/health
```

Checks the current CognoDB connection.

### Successful response

```text
200 OK
```

### Database unavailable

```text
503 Service Unavailable
```

The server also performs a connectivity check during startup.

If CognoDB is unavailable, the server still starts and logs a warning. Requests that require the database can then return an appropriate `503` response.

---

# People API

## Get people

```http
GET /api/people
```

Returns the available people.

## Get a person's skills

```http
GET /api/people/:personId/skills
```

Returns the skills directly associated with a person.

## Get matching jobs for a person

```http
GET /api/people/:personId/matches
```

Runs the graph-based matching traversal and returns jobs ranked by skill coverage.

---

# Jobs API

## Get jobs

```http
GET /api/jobs
```

Returns the available jobs.

## Get a job's required skills

```http
GET /api/jobs/:jobId/skills
```

Returns the skills required by a job.

## Get candidates for a job

```http
GET /api/jobs/:jobId/candidates
```

Runs the reverse graph traversal and returns people ranked by their proximity to the job's required skills.

---

# Matches API

Matching operations are also exposed through a dedicated `/api/matches` router.

## Person matches

```http
GET /api/matches/people/:personId
```

Returns matching jobs for a person.

## Job candidates

```http
GET /api/matches/jobs/:jobId
```

Returns candidate people for a job.

The resource-oriented routes and match-oriented routes both delegate to the same matching controller logic.

---

# Skills API

## Skill graph

```http
GET /api/skills/graph
```

Returns the complete skill graph.

The frontend uses this data to power the skill graph visualization.

## Related skills

```http
GET /api/skills/:skillId/related
```

Returns the related skill neighborhood around a specific skill.

The traversal supports the configured 1–2 hop relationship expansion.

---

# Project structure

The project is split into a React frontend and Express backend.

```text
skillbridge/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   │
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.tsbuildinfo
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── db.ts
│   │   ├── queries.ts
│   │   ├── seed.ts
│   │   └── server.ts
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

# Backend architecture

The backend is built with:

- Node.js
- Express
- TypeScript
- `neo4j-driver`
- CognoDB

The server is organized into controllers, routes, database access, queries, and middleware.

```text
HTTP Request
     ↓
Express Router
     ↓
Controller
     ↓
Query / Database Layer
     ↓
CognoDB
     ↓
Response
```

## Routes

The main routers are:

```text
server/src/routes/
├── peopleRoutes.ts
├── jobRoutes.ts
├── matchRoutes.ts
└── skillRoutes.ts
```

They are mounted in `server.ts`:

```ts
app.use("/api/people", peopleRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/matches", matchRouter);
app.use("/api/skills", skillRouter);
```

This keeps the HTTP layer separated by domain.

---

# Controllers

Controller logic is separated from route definitions.

```text
server/src/controllers/
├── jobsController.ts
├── matchesController.ts
├── peopleController.ts
└── skillsController.ts
```

For example, the people router delegates matching to:

```text
getMatchesForPerson
```

while the jobs router delegates candidate discovery to:

```text
getCandidatesForJob
```

This keeps the route definitions small and makes the matching logic reusable.

---

# Database layer

CognoDB connection handling lives in:

```text
server/src/db.ts
```

The application uses the official `neo4j-driver` interface to communicate with CognoDB.

Cypher queries are centralized in:

```text
server/src/queries.ts
```

Queries use parameters rather than concatenating user input into Cypher statements.

This keeps the database layer safer and easier to maintain.

---

# Error handling

The API uses shared error middleware:

```text
server/src/middleware/errorHandler.ts
```

Database connectivity problems are converted into appropriate HTTP responses instead of exposing raw stack traces to API consumers.

The frontend can therefore display a useful error state and allow the user to retry the request.

---

# Frontend

The frontend is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query

The main application entry points are:

```text
client/src/
├── App.tsx
├── main.tsx
└── index.css
```

Reusable UI components live under:

```text
client/src/components/
```

Application configuration lives under:

```text
client/src/config/
```

API/data access logic lives under:

```text
client/src/services/
```

---

# TanStack Query

SkillBridge uses **TanStack Query** for server-state management.

Instead of manually managing loading, error, caching, and refetching state for every API request, the frontend uses TanStack Query to handle asynchronous server data.

Conceptually:

```text
React Component
      ↓
TanStack Query
      ↓
Service / API function
      ↓
Express API
      ↓
CognoDB
```

This gives the frontend:

- request caching,
- loading states,
- error states,
- automatic refetching,
- query invalidation,
- request deduplication,
- and simpler React components.

The API interaction is therefore separated from presentation logic.

For example, a component can consume query state conceptually like:

```text
data
isLoading
isError
error
refetch
```

instead of manually maintaining separate `useState` values for each request.

This is especially useful for SkillBridge because the UI makes several server requests while switching between people, jobs, matches, and skill graphs.

---

# Frontend data flow

A typical person-to-job flow looks like:

```text
User selects person
        ↓
React component
        ↓
TanStack Query
        ↓
GET /api/people/:personId/matches
        ↓
Express controller
        ↓
CognoDB graph traversal
        ↓
Ranked matches
        ↓
TanStack Query cache
        ↓
Match UI
```

The same approach is used for job-to-candidate matching and skill graph data.

---

# UI features

The frontend supports the two primary matching directions:

## Find jobs for a person

```text
Select person
      ↓
View their skills
      ↓
Run graph traversal
      ↓
Display matching jobs
      ↓
Rank by skill coverage
```

## Find candidates for a job

```text
Select job
      ↓
View required skills
      ↓
Run reverse graph traversal
      ↓
Display candidate people
      ↓
Rank by skill proximity
```

The skill graph can also be visualized independently.

---

# Environment variables

## Server

Create:

```text
server/.env
```

from:

```text
server/.env.example
```

Configure:

```env
COGNODB_URI=bolt+s://<instance-id>.databases.cognodb.cloud
COGNODB_USER=cognodb
COGNODB_PASSWORD=<password>

PORT=4000
CORS_ORIGIN=*
```

For production, replace `CORS_ORIGIN=*` with the actual frontend origin.

Example:

```env
CORS_ORIGIN=https://your-frontend-domain.com
```

## Client

Create:

```text
client/.env
```

from:

```text
client/.env.example
```

Configure:

```env
VITE_API_URL=http://localhost:4000/api
```

For production:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

# Setup

## 1. Create a CognoDB instance

Create a CognoDB instance through the CognoDB console.

After provisioning, obtain:

```text
COGNODB_URI
COGNODB_USER
COGNODB_PASSWORD
```

The URI should look similar to:

```text
bolt+s://<instance-id>.databases.cognodb.cloud
```

Keep the database password secure.

---

# 2. Start the backend

Open a terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Fill in the CognoDB credentials.

Then seed the database:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:4000
```

Check the database connection:

```text
http://localhost:4000/api/health
```

---

# 3. Start the frontend

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:4000/api
```

Start Vite:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

# Seed data

The project includes a small dataset designed to demonstrate graph-based matching.

The dataset contains:

- 12 skills
- 6 jobs
- 3 companies
- 5 people
- person-to-skill relationships
- job-to-skill requirements
- skill-to-skill relationships

The seed process is designed to be repeatable using `MERGE` operations.

Seed logic is located in:

```text
server/src/seed.ts
```

with supporting data under:

```text
server/src/data/
```

---

# Error handling and resilience

The server performs a CognoDB connectivity check when it starts.

If the database is available:

```text
[server] Connected to CognoDB.
```

If the database is temporarily unavailable:

```text
[server] Starting even though CognoDB is unreachable right now (...)
Requests will return 503 until the connection is restored.
```

The server does not immediately crash because of a temporary database outage.

The health endpoint also reflects the current database state:

```text
200 → database available

503 → database unavailable
```

The frontend can use this information to display an appropriate error state and provide a retry action.

---

# API summary

| Method | Endpoint                        | Purpose                    |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/api/health`                   | Check CognoDB connectivity |
| GET    | `/api/people`                   | List people                |
| GET    | `/api/people/:personId/skills`  | Get person's skills        |
| GET    | `/api/people/:personId/matches` | Find jobs for a person     |
| GET    | `/api/jobs`                     | List jobs                  |
| GET    | `/api/jobs/:jobId/skills`       | Get job requirements       |
| GET    | `/api/jobs/:jobId/candidates`   | Find candidates for a job  |
| GET    | `/api/matches/people/:personId` | Match a person to jobs     |
| GET    | `/api/matches/jobs/:jobId`      | Find candidates for a job  |
| GET    | `/api/skills/graph`             | Get full skill graph       |
| GET    | `/api/skills/:skillId/related`  | Get related skills         |

---

# Key design decisions

## 1. Graph-based matching

The core matching problem is relationship-driven, making a graph database a natural fit.

## 2. Variable-depth traversal

Skill relationships can be traversed 1–2 hops without changing the database schema.

## 3. Relationship properties

Important metadata belongs directly to relationships:

```text
HAS_SKILL.level
REQUIRES.importance
RELATED_TO.weight
```

## 4. Reusable backend layers

Routes, controllers, database access, queries, and error handling are separated.

## 5. TanStack Query for server state

The frontend uses TanStack Query instead of manually implementing request caching and asynchronous state management.

This keeps UI components focused on presentation and user interaction.

## 6. Reverse matching

The same graph can answer both:

```text
Person → Jobs
```

and:

```text
Job → People
```

without requiring a separate matching data model.

---

# Deployment

The backend can be deployed to a Node.js-compatible platform such as Render or Fly.io.

Configure the backend environment variables:

```env
COGNODB_URI=<CognoDB URI>
COGNODB_USER=cognodb
COGNODB_PASSWORD=<CognoDB password>
PORT=<platform-provided port>
CORS_ORIGIN=<frontend origin>
```

The frontend can be deployed to Vercel, Netlify, or another static hosting provider.

Configure:

```env
VITE_API_URL=<deployed backend API URL>
```

Make sure the CognoDB instance remains available while the deployed demo is being evaluated.

---

# Example matching concept

Suppose the person has:

```text
React
Docker
```

The graph contains:

```text
React ───── TypeScript
   │
   └─────── GraphQL

Docker ─── Kubernetes
```

And a job requires:

```text
TypeScript
React
GraphQL
Kubernetes
```

The graph traversal can discover:

```text
React
  ↓
TypeScript

React
  ↓
GraphQL

Docker
  ↓
Kubernetes
```

The person therefore has meaningful proximity to the job even though they did not explicitly list every required keyword.

This is the core value proposition of SkillBridge.

---

# Summary

SkillBridge demonstrates how a graph database can power a more flexible skill-matching system than traditional keyword search.

The core workflow is:

```text
Known skills
     ↓
1–2 hop skill expansion
     ↓
Reachable job requirements
     ↓
Coverage calculation
     ↓
Ranked job matches
```

And in reverse:

```text
Job requirements
     ↓
1–2 hop skill expansion
     ↓
People with reachable skills
     ↓
Coverage calculation
     ↓
Ranked candidates
```

The frontend uses **React + TypeScript + TanStack Query** to consume the API and manage server state, while the backend uses **Express + TypeScript + CognoDB** to perform the graph traversal.

The result is a matching system that asks:

> **"How close is this person to the skill graph required by this job?"**

rather than simply:

> **"Does this person have the exact keyword?"**
