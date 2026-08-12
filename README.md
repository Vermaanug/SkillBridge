# SkillBridge

A small graph-backed app that answers a question a resume keyword search can't:
**"what am I actually close to, even through skills I haven't listed?"**

Given a person, SkillBridge walks outward from their known skills — through a
skill-adjacency graph — and surfaces jobs they partially or fully qualify for,
ranked by how much of each job's requirement set they cover. It also runs the
same traversal in reverse: given a job, find the people closest to it.

Built for the Wexa AI CognoDB take-home assignment.

---

## Why a graph database?

The interesting question here — *"how much of this job's skill graph does this
person's skill graph, expanded one or two hops through related skills, cover?"*
— is a variable-depth traversal over a many-to-many relationship, followed by a
per-node set comparison. In a relational schema that means:

- A recursive CTE to expand "related skills" outward by 1–2 hops.
- A join from there back into a `job_requirements` bridge table.
- A `GROUP BY` per job to compute "matched / total required" against a
  *dynamically sized* set that only exists after the recursive step finished.
- Doing all of that again, in the opposite direction, for the reverse lookup.

In CognoDB it's one pattern: `(:Person)-[:HAS_SKILL]->(:Skill)-[:RELATED_TO*1..2]-(:Skill)<-[:REQUIRES]-(:Job)`.
The traversal depth is a query parameter, not a schema decision, so "how far
should adjacency count?" can change without a migration. Relationships also
carry their own properties here (`HAS_SKILL.level`, `REQUIRES.importance`,
`RELATED_TO.weight`) and participate directly in the traversal — no separate
join table doing double duty as both a relationship and a payload.

The other queries (list a person's skills, list a job's requirements, expand
one skill's neighborhood for the mini skill-graph) would be fine in SQL too —
they're here for completeness, not to make a point.

## Data model

```
 (:Person {id, name, headline})
        |
        | HAS_SKILL {level: 1-4}
        v
  (:Skill {id, name, category}) <---- RELATED_TO {weight: 0-1} ----> (:Skill)
        ^
        | REQUIRES {importance: 1-3}
        |
   (:Job {id, title, company, location, description})
```

- **Person –HAS_SKILL→ Skill** — `level` is self-rated proficiency (1–4).
- **Job –REQUIRES→ Skill** — `importance` is how central that skill is to the
  role (1 nice-to-have, 3 must-have).
- **Skill –RELATED_TO– Skill** — an undirected co-occurrence edge with a
  `weight` (e.g. `TypeScript` and `React` are strongly related; `Docker` and
  `GraphQL` weakly so). This is the edge the multi-hop traversal expands
  across — it's what lets "knows React" count as partial credit toward a job
  that asks for TypeScript.

Seed data: 12 skills, 6 jobs at 3 companies, 5 people, and the `HAS_SKILL` /
`REQUIRES` / `RELATED_TO` edges connecting them — see
`backend/src/data/seedData.ts`.

## Queries (see `backend/src/queries.ts` for the full Cypher)

| Endpoint | What it does |
|---|---|
| `GET /api/people/:id/matches` | **Multi-hop.** Expands a person's skills 1–2 hops through `RELATED_TO`, then finds every job reachable from that expanded set and scores it by coverage. |
| `GET /api/jobs/:id/candidates` | The same traversal, reversed: ranks people by closeness to a job. |
| `GET /api/skills/:id/related` | 1–2 hop neighborhood of one skill, for the "related skills" view. |
| `GET /api/skills/graph` | The full skill co-occurrence graph, for visualization. |
| `GET /api/people/:id/skills`, `GET /api/jobs/:id/skills` | Direct one-hop lookups. |

All queries are parameterized through the official `neo4j-driver` — no string
concatenation anywhere in `src/`.

## Project structure

```
skillbridge/
├── backend/            Express + TypeScript API
│   ├── src/
│   │   ├── db.ts       Driver setup, session handling, connectivity check
│   │   ├── queries.ts  Every Cypher query, parameterized
│   │   ├── routes.ts   REST endpoints
│   │   ├── server.ts   App entrypoint, health check, error middleware
│   │   ├── seed.ts     Idempotent seed script (MERGE-based)
│   │   └── data/seedData.ts
│   └── .env.example
└── frontend/           React + TypeScript + Tailwind (Vite)
    └── src/
        ├── api.ts       Typed fetch client
        ├── App.tsx       Two modes: person→jobs, job→candidates
        └── components/   Picker, match cards, hero graph, loading/empty/error states
```

## Setup

### 1. Create a CognoDB instance

1. Sign up at [console.cognodb.com/signup](https://console.cognodb.com/signup) (no credit card needed).
2. Create a free `c0` instance, pick a region, wait for provisioning (~1 min).
3. Copy the `bolt+s://<instance-id>.databases.cognodb.cloud` URI and the
   generated password for user `cognodb` — **the password is shown once.**

### 2. Backend

```bash
cd backend
cp .env.example .env      # fill in COGNODB_URI / COGNODB_USER / COGNODB_PASSWORD
npm install
npm run seed               # loads the seed dataset
npm run dev                 # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env       # defaults to http://localhost:4000/api, adjust if needed
npm install
npm run dev                 # http://localhost:5173
```

Open `http://localhost:5173`. Pick a person to see the jobs their skill graph
reaches, or flip to "Find candidates for a job" to run the traversal the other
way.

### Error handling

If CognoDB is unreachable, `GET /api/health` returns `503` with the driver's
error message, and the server logs a clear reason on boot instead of hanging.
Every route shares one error middleware that turns connectivity failures into
a `503` with a plain-language message rather than a stack trace; the frontend
surfaces that message through the `ErrorState` component with a retry button.

## Deploying a demo

Any free tier works — e.g. Render or Fly.io for the `backend/` (set the three
`COGNODB_*` env vars there), and Vercel or Netlify for the `frontend/` (set
`VITE_API_URL` to the deployed backend's URL). Keep the CognoDB instance
running for as long as the assignment says to.
# SkillBridge
